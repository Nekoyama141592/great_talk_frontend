import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'

export const PostIndexComponent = () => {
  const { uid } = useParams()
  const queryFn = async () => {
    const colRef = collection(db, `public/v1/users/${uid}/posts`)
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(30))
    const querySnapshot = await getDocs(q)

    const postsData: PublicPost[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        customCompleteText: data.customCompleteText,
        description: data.description,
        image: data.image,
        msgCount: data.msgCount,
        uid: data.uid,
        postId: data.postId,
        title: data.title,
        createdAt: data.createdAt,
      }
    })
    return postsData
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['user-posts'],
    queryFn: queryFn,
  })
  if (error) return <div>{error.message}</div>
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>データがありません</div>
  const posts: PublicPost[] = data
  return (
    <ul>
      {posts.map(post => (
        <li
          key={post.postId}
          className='border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8'
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
