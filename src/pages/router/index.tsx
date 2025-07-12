import { Routes, Route } from 'react-router-dom'
import CreatePost from '../create-post'
import Posts from '../posts'
import User from '../users/user'
import CheckAuth from '../../common/check-auth'
import Users from '../users'
import UserIndex from '../users/user-index'
import Post from '../users/user-posts/post'
import UserPosts from '../users/user-posts'
import PostIndex from '../users/user-posts/post-index'
const Router = () => {
  return (
    <CheckAuth>
      <Routes>
        <Route path='/' element={<Posts />} />
        <Route path='/createPost' element={<CreatePost />} />
        <Route path='/users' element={<Users />}>
          <Route index element={<UserIndex />} />
          <Route path=':uid' element={<User />} />
        </Route>
        <Route path='/users/:uid/posts' element={<UserPosts />}>
          <Route index element={<PostIndex />} />
          <Route path=':postId' element={<Post />} />
        </Route>
      </Routes>
    </CheckAuth>
  )
}
export default Router
