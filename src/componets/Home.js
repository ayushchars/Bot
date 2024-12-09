import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IsLoadingHOC from './IsLoadingHOC';

function Home({setLoading}) {
  const randomLevel =["beginner","advanced","middle"]
  const randomlevel = randomLevel[Math.floor(Math?.random() * randomLevel?.length)];
  const [payload, setpayload] = useState({
    username: "",
    languages: "",
    level: "advanced",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setpayload((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClick = async () => {
    try {
      setLoading(true)
      await axios.post(`${process.env.REACT_APP_BASEURL}/interview-bot`, payload)
        .then((res) => {
          const resData = res.data
          setLoading(false)
          navigate('/question', { state: { questions: resData.data } })
        })
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-2xl font-semibold mb-6">My Bot</h2>
        <input
          type="text"
          value={payload.username}
          name="username"
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Enter your username"
        />
        <input
          type="text"
          value={payload.languages}
          name="languages"
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Enter languages"
        />
        <button
          onClick={handleClick}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Start
        </button>
      </div>
    </div>
  )
}

export default IsLoadingHOC(Home)
