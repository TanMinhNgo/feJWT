import './App.scss'
import Nav from './components/Navigation/Nav'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Nav />
      <h1>Welcome to React with Vite and TypeScript</h1>
      <Routes >
        <Route path="/"> Home </Route>
        <Route path="/news"> News </Route>
        <Route path="/contact"> Contact </Route>
        <Route path="/about"> About </Route>
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  )
}

export default App
