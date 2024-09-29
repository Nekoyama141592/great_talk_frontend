import './App.css'
import CreatePost from './create-post'
import { auth } from '../infrastructures/firebase'
import { useDispatch } from 'react-redux'
import { initUser, clearUser } from '../reducers/authReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './home'
import Posts from './posts'
import PostIndex from './posts/post-index'
import Post from './posts/post'

function App() {
  const dispatch = useDispatch()
  const init = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user
        const payload = { uid }
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
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/posts" element={<Posts />}>
          <Route index element={<PostIndex />} />
          <Route path=":postId" element={<Post />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
