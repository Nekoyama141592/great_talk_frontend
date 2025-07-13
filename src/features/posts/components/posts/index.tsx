import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicPost } from '@shared/schema/public-post'
import { usePosts, PostSortType } from '@features/posts/hooks/use-posts'

export const PostsComponent = () => {
  const [sortType, setSortType] = useState<PostSortType>('popularity')
  const { data, isPending, error } = usePosts(sortType)

  if (error) return <div>{error.message}</div>
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>データがありません</div>

  const posts: PublicPost[] = data

  return (
    <div>
      {/* Sorting Controls */}
      <div className='mb-6 flex gap-4 justify-center'>
        <button
          onClick={() => setSortType('popularity')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            sortType === 'popularity'
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
          }`}
        >
          人気順
        </button>
        <button
          onClick={() => setSortType('newest')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            sortType === 'newest'
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
          }`}
        >
          新着順
        </button>
      </div>

      {/* Posts List */}
      <ul>
        {posts.map(post => (
          <li
            key={post.postId}
            className='border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8'
          >
            <Link to={`/users/${post.uid}/posts/${post.postId}`}>
              <p>{post.title.value}</p>
              <p>{post.description.value}</p>
              <p>{post.msgCount}コメント</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
