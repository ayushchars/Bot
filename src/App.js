import React from 'react'
import { Routes ,Route } from 'react-router-dom'
import Home from './componets/Home'
import Question from './componets/Question'
import Analytics from './componets/Analytics'
import Result from './componets/Result'
import History from './componets/History'
import Read from './componets/Read'
import QuestionAnswerPage from './componets/QuestionAnswerPage'
function App() {
  return (
  <>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/question' element={<Question/>}/>
    <Route path='/analytics' element={<Analytics/>}/>
    <Route path='/result' element={<Result/>}/>
    <Route path='/history' element={<History/>}/>
    <Route path='/read' element={<Read/>}/>
    <Route path='/ask' element={<QuestionAnswerPage/>}/>
  </Routes>
  </>
  )
}

export default App