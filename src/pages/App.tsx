import './App.css'
import About from './about'
import CreatePost from './create-post'
import { auth } from '../infrastructures/firebase'
import { useDispatch } from 'react-redux'
import { initUser, clearUser } from '../reducers/authReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './home'

function App() {
  const dispatch = useDispatch()
  const init = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid } = user
        const payload = { email, uid }
        const action = initUser(payload)
        dispatch(action)
      } else {
        const payload = {}
        const action = clearUser(payload)
        dispatch(action)
      }
    })
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/createPost" element={<CreatePost />} />
      </Routes>
    </>
  )
}

export default App
