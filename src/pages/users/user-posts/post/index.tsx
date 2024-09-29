import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../infrastructures/firebase'
import PublicPost from '../../../../schema/public-post'
import { useState } from 'react'
import { 
  getFunctions,
  httpsCallable
} from '@firebase/functions';

interface Response {
  message: string
}
function Post() {
  const [response,setResponse] = useState<string>('');
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
  const onClick = async () => {
    setResponse('スタート！！！！！！！！！！');
    const functions = getFunctions();
    const generateText = httpsCallable(functions, 'generateText');
    generateText({ text: "React.jsを上達するコツを教えてください。" })
    .then((result) => {
      const data = result.data as Response;
      setResponse(data.message)
    }).catch((e) => {
      setResponse(`${e}`)
    });

  }
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
      <button onClick={onClick}>ボタンをクリック</button>
      <p>{response}</p>
    </>
  )
}

export default Post
