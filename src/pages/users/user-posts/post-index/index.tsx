import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../../../../infrastructures/firebase'
import PublicPost from '../../../../schema/public-post'

function PostIndex() {
  const { uid } = useParams()
  const [posts, setPosts] = useState<PublicPost[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const colRef = collection(db, `public/v1/users/${uid}/posts`)
        const q = query(colRef, orderBy('createdAt', 'desc'), limit(30))
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
      } catch (err) {
        setError(err?.toString() ?? 'ERROR')
      }
    }

    fetchPosts()
  }, [uid])

  if (error) return <div>{error}</div>
  if (!posts) return <div>読み込み中...</div>
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.postId}
          className="border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8"
        >
          <Link to={`${post.postId}`}>
            <p>{post.title.value}</p>
            <p>{post.description.value}</p>
            <p>{post.msgCount}コメント</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PostIndex