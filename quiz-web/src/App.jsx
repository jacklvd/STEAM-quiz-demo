import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.scss'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard.jsx'))
const Quiz = lazy(() => import('./pages/Quiz/Quiz.jsx'))

function App() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/quiz' element={<Quiz />} />
        </Routes>
      </Suspense>
    </>

  )
}

export default App
