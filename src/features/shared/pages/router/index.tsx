import { Routes, Route } from 'react-router-dom'
import { CreatePostComponent } from '@posts/components/create-post'
import { PostsComponent } from '@posts/components/posts'
import { UserComponent } from '@users/components/users/user'
import { CheckAuthComponent } from '@auth/components/check-auth'
import { UsersComponent } from '@users/components/users'
import { UserIndexComponent } from '@users/components/users/user-index'
import { PostComponent } from '@users/components/users/user-posts/post'
import { UserPostsComponent } from '@users/components/users/user-posts'
import { PostIndexComponent } from '@users/components/users/user-posts/post-index'
export const RouterComponent = () => {
  return (
    <CheckAuthComponent>
      <Routes>
        <Route path='/' element={<PostsComponent />} />
        <Route path='/createPost' element={<CreatePostComponent />} />
        <Route path='/users' element={<UsersComponent />}>
          <Route index element={<UserIndexComponent />} />
          <Route path=':uid' element={<UserComponent />} />
        </Route>
        <Route path='/users/:uid/posts' element={<UserPostsComponent />}>
          <Route index element={<PostIndexComponent />} />
          <Route path=':postId' element={<PostComponent />} />
        </Route>
      </Routes>
    </CheckAuthComponent>
  )
}
