import { Link } from 'react-router-dom'
import '../Home/styles/home.scss'

const Home = () => {
  return (
    <div className='container home-container'>
      <h1>Welcome To Knowledge Quiz</h1>
      <div className='button-general'>
        <Link to='/dashboard'><button className='button-home'>Dashboard</button></Link>
        <Link to='/quiz'><button className='button-home'>Quiz</button></Link>
      </div>
    </div>

  )
}

export default Home