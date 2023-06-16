import { useState, useEffect, useRef } from 'react'
import '../components/styles/quiz.scss'
import { Link } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

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
  const [quizData, setQuizData] = useState({})

  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);

  useEffect(() => {
    fetchQuizData();
    init();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/quiz');
      const data = await response.json();

      setQuizData(data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };

  let model, webcam, labelContainer, maxPredictions;

  const init = async () => {
    const URL = 'https://teachablemachine.withgoogle.com/models/Wo0uHD6ov/';

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
      const newDiv = document.createElement('div');
      labelContainer.appendChild(newDiv);
    }
  };

  const loop = async () => {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
      labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
    }
  };
  

  const { questions } = quizData;
  const activeQuestionData = questions && questions.length > activeQuestion ? questions[activeQuestion] : null;
  const { question, choices, correctAnswer } = activeQuestionData || {};

  const onClickNext = () => {
    setAnswerIndex(null)
    setResult((prev) => ( answer ? { 
      ...prev,
      score: prev.score + 1,
      correctAnswers: prev.correctAnswers + 1
    } : { ...prev, wrongAnswers: prev.wrongAnswers + 1 } ))
    if (activeQuestion !== questions.length - 1) {
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
          <span className='total-questions'>/{addZeroPrefix(quizData.totalQuestions)}</span>
        </div>
        <h2 className='question'>{question}</h2>
        <ul>
          {choices && choices.map((choice, index) => (
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
            activeQuestion === quizData.totalQuestions - 1 ? 'Finish' : 'Next'
          }</button>
        </div>
        <div id='webcam-container' ref={webcamContainerRef}></div>
        <div id='label-container' ref={labelContainerRef}></div>     
        </>
      ) : (
        <>
          <div className="result-card">
            <h3 className='result'>Result</h3>
            <p>
              Total Question: <span>{questions ? questions.length : 0}</span>
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