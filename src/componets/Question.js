import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Question() {
  const { state } = useLocation();
  const [questions, setQuestions] = useState(state.questions?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
const randomLevel =["beginner","advanced","middle"]
const level = randomLevel[Math.floor(Math?.random() * randomLevel?.length)];
  const currentQuestion = questions[currentQuestionIndex];
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const fetchMoreQuestions = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASEURL}/interview-bot`, {
      
        username: state?.questions?.username,
        languages: state?.questions?.languages,
        level: level,
      });
      if (res?.data.status === 1) {
        setQuestions((prevQuestions) => [...prevQuestions, ...res?.data?.data?.questions]);
      } else {
        console.error("No new questions returned");
      }
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setIsFetching(false);
    }
  };

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

      if (questions.length - currentQuestionIndex <= 2) {
        await fetchMoreQuestions();
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        alert("Quiz completed! Check your results.");
        console.log(results);
      }
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const showResult = () => {
    navigate('/result', { state: { result: results } });
  };

  const life = results?.filter((item) => item?.correct === false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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

export default Question;
