import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../infrastructures/firebase'
import PublicPost from '../../../../schema/public-post'
import { useState } from 'react'
import { getFunctions, httpsCallable } from '@firebase/functions'
import ReactMarkdown from 'react-markdown'

interface Response {
  message: string
}
function Post() {
  const [response, setResponse] = useState<string>('')
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
  const [inputText, setInputText] = useState('')

  const onClick = async (systemPrompt: string, text: string) => {
    setResponse('読み込み中...')
    const functions = getFunctions()
    const generateText = httpsCallable(functions, 'generateTextV2')
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ]
    generateText({ messages })
      .then(result => {
        const data = result.data as Response
        setResponse(data.message)
      })
      .catch(e => {
        setResponse(`${e}`)
      })
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    systemPrompt: string
  ) => {
    e.preventDefault()
    onClick(systemPrompt, inputText)
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
      <form
        onSubmit={e => handleSubmit(e, post.customCompleteText.systemPrompt)}
      >
        <input
          type='text'
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder='質問を入力'
        />
        <button type='submit'>質問を送信</button>
      </form>
      <ReactMarkdown>{response}</ReactMarkdown>
    </>
  )
}

export default Post
