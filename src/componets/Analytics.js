import React from 'react'
import PieChart from './pieChart'
import DateChart from './DateChart'
import { useNavigate } from 'react-router-dom'

function Analytics() {
  const navigate = useNavigate()

  return (
    <>
    <img src='/back.png' style={{height :40 ,width : 40, paddingTop :20,paddingLeft :20}} onClick={()=>navigate("/result")} />
    <PieChart/>
    <DateChart/>
    </>
  )
}

export default Analytics