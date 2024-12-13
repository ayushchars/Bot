import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const { state } = useLocation();
  const results = state?.result || [];
  const totalAttempted = results.length;
  const totalCorrect = results.filter((item) => item.correct).length;

  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <img src='/back.png' className="absolute top-4 left-4 h-[20px]" onClick={()=>navigate("/")}/>
      <button
       
        className="absolute top-4 right-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600"
      onClick={()=>navigate("/analytics")}
      >Analytics</button>
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">Quiz Results</h1>
          <p className="text-gray-700">
            Attempted: <span className="font-semibold">{totalAttempted}</span> | Correct: <span className="font-semibold text-green-500">{totalCorrect}</span>
          </p>
        </div>
        <div className="space-y-6">
          {results.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                item.correct ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-800">Question {index + 1}: {item.question}</h2>
              <p className="text-gray-700">
                <span className="font-medium">Your Answer:</span> {item.selectedOption}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Correct Answer:</span> {item.correctAnswer}
              </p>
              <h4
                className={`text-sm font-bold mt-2 ${
                  item.correct ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.correct ? 'Correct' : 'Wrong'}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Result;
