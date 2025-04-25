import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IsLoadingHOC from './IsLoadingHOC';
import { useDispatch, useSelector } from 'react-redux';
import { savehistory, savelanguage, saveResult } from '../Redux/Reducers/authSlice';
import { toast } from 'react-toastify';

function Question({ setLoading }) {
  const { state } = useLocation();
  const [questions, setQuestions] = useState(state?.questions?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const currentQuestion = questions[currentQuestionIndex];
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const fetchMoreQuestions = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_BASEURL}/interview-bot`, {
        username: state?.questions?.username,
        languages: state?.questions?.languages[0],
        level: "advanced",
      });

      if (res?.data.status === 1) {
        setQuestions((prevQuestions) => [...prevQuestions, ...res?.data?.data?.questions]);
        setLoading(false);
      } else {
        await fetchMoreQuestions();
      }
    } catch (err) {
      if (err?.response?.data?.message === "An error rate_limit_exceeded")
        {
          toast.error("Due to high traffic, please try again later. ")
      return showResult()
      }
      await fetchMoreQuestions();
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };
  const history = useSelector(state=>state?.auth?.history)

  const handleNext = async () => {
    if (selectedOption !== null) {
      setResults((prevResults) => [
        ...prevResults,
        {
          question: currentQuestion.question,
          selectedOption: currentQuestion.options[selectedOption],
          correctAnswer: currentQuestion.options[currentQuestion.answer],
          correct: selectedOption === currentQuestion.answer,
          options: currentQuestion.options,
        },
      ]);

      setSelectedOption(null);

      if (questions.length - currentQuestionIndex <= 8) {
        await fetchMoreQuestions();
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        alert("Quiz completed! Check your results.");
      }
    } else {
      alert("Please select an option before proceeding.");
    }
  };
  const name = useSelector(state => state.auth.name)

  const showResult = () => {
    const language = sessionStorage.getItem("languages");
    dispatch(
        savelanguage({
            language,
            attempt: results.length,
            correct,
        })
    );
    dispatch(saveResult(results))
    dispatch(savehistory([...history, results]));
    navigate("/result", { state: { result: results } });
};


  const correct = results.filter((item) => item.correct).length;
  const life = results?.filter((item) => item?.correct === false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
   <div className="absolute top-4 right-4 flex gap-2">
      {Array.from({ length: life?.length }).map((_, index) => (
        <img
          key={index}
          src="/no.png"
          alt={`Life image ${index + 1}`}
          className="w-10 h-10 object-cover"
        />
      ))}
    </div>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Hello, {state?.questions?.username}!</h1>

        {life?.length === 5 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">You made 5 or more mistakes</h2>
            <button
              onClick={showResult}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Show Results
            </button>
          </div>
        )}
        {currentQuestion && life?.length < 5 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>
            <ul className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <li key={key} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="option"
                    value={key}
                    checked={selectedOption === key}
                    onChange={() => handleOptionChange(key)}
                    className="w-4 h-4"
                  />
                  <label className="text-gray-700">{value}</label>
                </li>
              ))}
            </ul>
            <button
              onClick={handleNext}
              className="mt-6 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IsLoadingHOC(Question);
