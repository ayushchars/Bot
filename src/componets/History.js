import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IsLoadingHOC from './IsLoadingHOC';

function Result({ setLoading }) {
  const { state } = useLocation();
  const Result = useSelector((state) => state?.auth?.history.flat());
  const results = state?.result || Result || [];
  const totalAttempted = Result?.length;
  const totalCorrect = Result?.filter((item) => item?.correct)?.length;

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/ask-question`, { question });

      const resData = response?.data;
      console.log(resData, 'resData');
      if (resData?.status === 1) {
        setResponse(resData?.data?.ans);
        setOpenModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question) handleAsk();
  }, [question]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">Quiz Results</h1>
          <p className="text-gray-700">
            Attempted: <span className="font-semibold">{totalAttempted}</span> | Correct:{' '}
            <span className="font-semibold text-green-500">{totalCorrect}</span>
          </p>
        </div>

        <div className="space-y-6">
          {results.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                item.correct ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
              } flex justify-between items-center`}
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Question {index + 1}: {item.question}
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Your Answer:</span> {item.selectedOption}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Correct Answer:</span> {item.correctAnswer}
                </p>
                <div className="flex items-center">
                  <h4
                    className={`text-sm font-bold ${
                      item.correct ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.correct ? 'Correct' : 'Wrong'}
                  </h4>
                  <button
                    className="ml-2 text-blue-500 underline hover:text-blue-700 cursor-pointer"
                    onClick={() => setQuestion(item?.question)}
                  >
                    Ask me
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setOpenModal(false)}>
    <div className="bg-white rounded-lg shadow-lg w-[80vw] h-[80vh] p-6 relative flex flex-col">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        onClick={() => setOpenModal(false)}
      >
        &times;
      </button>
      <h4 className="text-xl font-bold mb-4 text-blue-500">{question}</h4>
      
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-lg font-bold text-green-600 mb-2">Response:</h4>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: response }}
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default IsLoadingHOC(Result);