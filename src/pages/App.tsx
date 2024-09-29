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
import User from './users/user'
import CheckAuth from '../common/check-auth'
import Users from './users'
import UserIndex from './users/user-index'
import Post from './users/user-posts/post'
import UserPosts from './users/user-posts'
import PostIndex from './users/user-posts/post-index'


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
    <CheckAuth>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/users" element={<Users />}>
          <Route index element={<UserIndex />} />
          <Route path=":uid" element={<User />} />
        </Route>
        <Route path="/users/:uid/posts" element={<UserPosts />}>
          <Route index element={<PostIndex />} />
          <Route path=":postId" element={<Post />} />
        </Route>
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </CheckAuth>
  )
}

export default App
