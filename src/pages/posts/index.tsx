import { Link } from 'react-router-dom'
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { db } from '../../infrastructures/firebase'
import { useQuery } from '@tanstack/react-query'
import PublicPost from '../../schema/public-post'
function Posts() {
  const queryFn = async () => {
    const colRef = collectionGroup(db, `posts`)
    const q = query(colRef, orderBy('msgCount', 'desc'), limit(30))
    const querySnapshot = await getDocs(q)

    const postsData: PublicPost[] = querySnapshot.docs.map((doc) => {
      const docData = doc.data()
      return {
        customCompleteText: docData.customCompleteText,
        description: docData.description,
        image: docData.image,
        msgCount: docData.msgCount,
        uid: docData.uid,
        postId: docData.postId,
        title: docData.title,
      }
    })
    return postsData
  }
  const { data, isPending, error } = useQuery({
    queryKey: ['posts'],
    queryFn: queryFn,
  })

  if (error) return <div>{error.message}</div>
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>データがありません</div>
  const posts: PublicPost[] = data
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.postId}
          className="border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8"
        >
          <Link to={`/users/${post.uid}/posts/${post.postId}`}>
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
