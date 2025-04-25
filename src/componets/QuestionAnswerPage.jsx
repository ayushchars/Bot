import axios from 'axios';
import React, { useState } from 'react';
import IsLoadingHOC from './IsLoadingHOC';

const QuestionAnswerPage = ({ setLoading }) => {
  const [language, setlanguage] = useState('');
  const [detail, setdetail] = useState({
    question: '',
    answer: '',
    result: '',
  });
  const handlelanguage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/ask-me-question`, { language });
      if (response.data.status === 1) {
        setdetail({
          question: response.data?.data?.question,
          answer: '',
          result: '',
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/validate-answer`, {
        question: detail.question,
        answer: detail.answer,
      });

      if (response.data.status === 1) {
        setdetail({
          question: response.data?.data?.question || '',
          answer: response.data?.data?.yourAnswer || '',
          result: response.data?.data?.validationResult || '',
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenrate = () => {
    setdetail({
      question: '',
      answer: '',
      result: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8 flex flex-col items-center relative">
  <div className="absolute top-8 right-8 flex items-center gap-4">
    <input
      type="text"
      placeholder="Enter Language"
      className="border border-gray-300 rounded-lg px-4 py-2 w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={language}
      onChange={(e) => setlanguage(e.target.value)}
    />
    <button
      className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
      onClick={handlelanguage}
    >
      Submit
    </button>
  </div>

  <div className="w-full max-w-2xl mt-28 bg-white rounded-2xl shadow-lg p-8 space-y-8">
    <div className="space-y-4">
      <label className="block text-gray-700 font-semibold">Your Question</label>
      <textarea
        placeholder="Enter your Question"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        value={detail.question}
        onChange={(e) => setdetail((prev) => ({ ...prev, question: e.target.value }))}
      />
    </div>

    <div className="space-y-4">
      <label className="block text-gray-700 font-semibold">Your Answer</label>
      <textarea
        placeholder="Enter your Answer"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        value={detail.answer}
        onChange={(e) => setdetail((prev) => ({ ...prev, answer: e.target.value }))}
      />
    </div>

    <div className="flex justify-between items-center pt-2">
      <button
        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
        onClick={handleAnswer}
      >
        Submit Answer
      </button>
      <button
        className="text-sm text-red-500 underline hover:text-red-600 transition"
        onClick={handleRegenrate}
      >
        Clear All
      </button>
    </div>
  </div>

  {detail.result && (
    <div className="w-full max-w-2xl mt-10 bg-white rounded-2xl shadow-lg p-8 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Result:</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: detail.result }}
      />
    </div>
  )}
</div>

  
  );
};

export default IsLoadingHOC(QuestionAnswerPage);
