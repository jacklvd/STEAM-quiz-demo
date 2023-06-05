import { useState } from 'react'
import '../components/styles/quiz.scss'
import { quiz } from '../data/questions'
import { Link } from 'react-router-dom'

const QuizCard = () => {

  const [activeQuestion, setActiveQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [answerIndex, setAnswerIndex] = useState(null)
  const [playAgain, setPlayAgain] = useState(false)
  const [result , setResult] = useState({
    score: 0,
    wrongAnswers: 0,
    correctAnswers: 0
  })

  const { questions } = quiz
  const { question, choices, correctAnswer } = questions[activeQuestion]

  const onClickNext = () => {
    setAnswerIndex(null)
    setResult((prev) => ( answer ? { 
      ...prev,
      score: prev.score + quiz.perQuestionScore,
      correctAnswers: prev.correctAnswers + 1
    } : { ...prev, wrongAnswers: prev.wrongAnswers + 1 } ))
    if (activeQuestion !== quiz.totalQuestions - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
      setActiveQuestion(0)
    }
  }

  const onClickPlayAgain = () => {
    setPlayAgain(true)
    setShowResults(false)
    setResult({
      score: 0,
      wrongAnswers: 0,
      correctAnswers: 0
    })
  }

  const selectedAnswer = (choice, index) => {
    setAnswerIndex(index)
    if (choice === correctAnswer) {
      setAnswer(true)
    } else {
      setAnswer(false)
    }
  }

  const addZeroPrefix = (num) => (num < 10 ? `0${num}` : num)

  return (
    <div className='quiz-container'>
      { !showResults && playAgain ? (
        <>
        <div>
          <span className='active-question'>{addZeroPrefix(activeQuestion + 1)}</span>
          <span className='total-questions'>/{addZeroPrefix(quiz.totalQuestions)}</span>
        </div>
        <h2 className='question'>{question}</h2>
        <ul>
          {choices.map((choice, index) => (
            <li
              key={choice}
              className={`${answerIndex === index ? 'selected' : null}`}
              onClick={() => selectedAnswer(choice, index)}
            > {choice}
            </li>
          ))}
        </ul>
        <div className='button-flex'>
          <button className='btn' onClick={onClickNext} disabled={answerIndex === null}>{
            activeQuestion === quiz.totalQuestions - 1 ? 'Finish' : 'Next'
          }</button>
        </div>        
        </>
      ) : (
        <>
          <div className="result-card">
            <h3 className='result'>Result</h3>
            <p>
              Total Question: <span>{questions.length}</span>
            </p>
            <p>
              Total Score:<span> {result.score}</span>
            </p>
            <p>
              Correct Answers:<span> {result.correctAnswers}</span>
            </p>
            <p>
              Wrong Answers:<span> {result.wrongAnswers}</span>
            </p>
          </div>
          <div className='button-flex'>
            <button className='btn' onClick={onClickPlayAgain}>Play Again</button>
            <Link to='/'><button>Home</button></Link>
          </div>        
        </>
      )}
    </div>

  )
}

export default QuizCard