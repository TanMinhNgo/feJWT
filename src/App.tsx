import './App.scss'
import Login from './components/Login/Login'
import Nav from './components/Navigation/Nav'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import News from './News'
import Contact from './Contact'
import About from './About'
import Register from './components/Register/Register'

function App() {
  return (
    <div>
      <Nav />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  )
}

export default App
