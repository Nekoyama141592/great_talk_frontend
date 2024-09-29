import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../infrastructures/firebase'
import PublicPost from '../../schema/public-post'
function Posts() {
  const [posts, setPosts] = useState<PublicPost[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cacheKey = 'posts_cache'
        const cachedData = localStorage.getItem(cacheKey)
        const cacheTime = localStorage.getItem(`${cacheKey}_time`)
        const now = new Date().getTime()

        if (cachedData && cacheTime && now - parseInt(cacheTime) < 3600000) {
          setPosts(JSON.parse(cachedData))
        } else {
          const colRef = collectionGroup(db, `posts`)
          const q = query(colRef, orderBy('msgCount', 'desc'), limit(30))
          const querySnapshot = await getDocs(q)

          const postsData: PublicPost[] = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              customCompleteText: data.customCompleteText,
              description: data.description,
              image: data.image,
              msgCount: data.msgCount,
              uid: data.uid,
              postId: data.postId,
              title: data.title,
            }
          })
          setPosts(postsData)
          localStorage.setItem(cacheKey, JSON.stringify(postsData))
          localStorage.setItem(`${cacheKey}_time`, now.toString())
        }
      } catch (err) {
        setError(err?.toString() ?? 'ERROR')
      }
    }

    fetchPosts()
  }, [])

  if (error) return <div>{error}</div>
  if (!posts) return <div>読み込み中...</div>
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.postId}
          className="border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8"
        >
          <Link to={`/posts/${post.postId}`}>
            <p>{post.title.value}</p>
            <p>{post.description.value}</p>
            <p>{post.msgCount}コメント</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
