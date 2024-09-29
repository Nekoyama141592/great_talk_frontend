import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../infrastructures/firebase'
import PublicPost from '../../../../schema/public-post'

function Post() {
  const { uid, postId } = useParams()
  const queryFn = async () => {
    if (!uid || !postId) return
    const docRef = doc(db, `public/v1/users/${uid}/posts`, postId)
    const postDoc = await getDoc(docRef)
    const data = postDoc.data()
    if (!data) return
    const res: PublicPost = {
      customCompleteText: data.customCompleteText,
      description: data.description,
      image: data.image,
      msgCount: data.msgCount,
      postId: data.postId,
      title: data.title,
      uid: data.uid,
    }
    return res
  }
  const { data, isPending, error } = useQuery({
    queryKey: ['post'],
    queryFn: queryFn,
  })
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>投稿が存在しません</div>
  if (error) return <div>{error.message}</div>
  const post: PublicPost = data
  return (
    <>
      <h2>
        {post?.title.value} by {post?.uid}
      </h2>
      <p>{post?.description.value}</p>
      <p>{post?.msgCount}コメント</p>
    </>
  )
}

export default Post
