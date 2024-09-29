import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../../infrastructures/firebase"
import PublicPost from "../../../../schema/public-post"

function Post() {
  const { uid, postId } = useParams()
  const [post, setPost] = useState<PublicPost | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!uid || !postId) {
      return
    }
    const fetchPostData = async () => {
      try {
        const docRef = doc(db, `public/v1/users/${uid}/posts`, postId)
        const postDoc = await getDoc(docRef)
        if (postDoc.exists()) {
          const data = postDoc.data()
          const res: PublicPost = {
            customCompleteText: data.customCompleteText,
            description: data.description,
            image: data.image,
            msgCount: data.msgCount,
            postId: data.postId,
            title: data.title,
            uid: data.uid,
          }
          setPost(res)
        } else {
          setError('投稿が存在しません')
        }
      } catch (err) {
        setError(err?.toString() ?? 'ERROR')
      }
    }

    fetchPostData()
  }, [uid, postId])

  if (error) {
    return <h3>{error}</h3>
  }

  return (
    <>
      <h2>{post?.title.value} by {post?.uid}</h2>
      <p>{post?.description.value}</p>
      <p>{post?.msgCount}コメント</p>
    </>
  )
}

export default Post
