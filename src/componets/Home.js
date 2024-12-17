import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IsLoadingHOC from './IsLoadingHOC';
import { useDispatch, useSelector } from 'react-redux';
import { seveUser } from '../Redux/Reducers/authSlice';
import { toast } from 'react-toastify';

function Home({setLoading}) {
  const [payload, setpayload] = useState({
    username: "",
    languages: "",
    level: "advanced",
  })
  const navigate = useNavigate()
  const [isFetching, setIsFetching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setpayload((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const dispatch = useDispatch()
  const handleClick = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_BASEURL}/interview-bot`, payload);
      const resData = res.data; 
  
      if (resData.status === 1) {
        dispatch(seveUser({
          name: resData?.data?.username,
          languages: resData?.data?.languages
        }));
        navigate('/question', { state: { questions: resData.data } });
        sessionStorage.setItem("languages", resData?.data?.languages);
      } else {
        await handleClick();
      }
    } catch (err) {
      
      if (err?.response?.data?.message === "An error rate_limit_exceeded")
        {
        toast.error("Due to high traffic, please try again later. ")
      return
      }

       else if(err?.response?.data?.message != "enter valid lang"){
        await handleClick();

      }
      else  if (err?.response?.data?.message === "enter valid lang"){
        toast.error("Please enter valid progaming language")
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };
  


  useEffect(()=>{
    const startServer = async()=>{
      setLoading(true)
      try{

       const response = await axios.get(`${process.env.REACT_APP_BASEURL}/run-server`)

       const resData = response.data
        if(resData.status === 1){
          setLoading(false)
        }
    }catch(Err){
      console.log(Err)
      setLoading(false)
    }
    }
    startServer()

  },[])

  const state = useSelector(state => state.auth.user )
  
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
