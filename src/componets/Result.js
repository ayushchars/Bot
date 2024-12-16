import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import IsLoadingHOC from './IsLoadingHOC';

function Result({setLoading}) {
  const { state } = useLocation();
  const Result = useSelector(state => state?.auth?.lastResult);
  const results = state?.result || Result || [];
  const totalAttempted = results.length;
  const totalCorrect = results.filter((item) => item.correct).length;

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  
  const navigate = useNavigate();

  const handleAsk = async (que) => {
    setLoading(true)
    try{const response = await axios.post(`${process.env.REACT_APP_BASEURL}/ask-question`,{question} || {que})

    const resData = response?.data
    console.log(resData,"resDataresData")
    if(resData?.status=== 1){
      setLoading(false)
      setResponse(resData?.data?.ans)
    }
  }catch(err){
    setLoading(false)
    console.log(err)
  }
  };

  useEffect(()=>{
    handleAsk()
  },[question])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <img src='/back.png' className="absolute top-4 left-4 h-[20px]" onClick={() => navigate("/")} />
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600"
        onClick={() => navigate("/analytics")}
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
      } flex justify-between items-center`}
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Question {index + 1}: {item.question}</h2>
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
          <h1 className="ml-2 text-gray-700" onClick={()=>setQuestion(item?.question)}>Ask me</h1>
        </div>
      </div>
    </div>
  ))}
</div>
        
        <div className="mt-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAsk}
            className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600"
          >
            Ask
          </button>
          
          {response && (
            <div className="mt-4 bg-green-100 p-4 rounded-lg border-l-4 border-green-500 text-gray-700">
              <h4 className="text-red-600 font-bold">{question}</h4>
              <h4 className="text-green-600 font-bold">Response:</h4>
              <div 
                dangerouslySetInnerHTML={{ __html: response }} 
            />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IsLoadingHOC(Result);
