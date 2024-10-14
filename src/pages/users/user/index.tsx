import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../infrastructures/firebase'
import PublicUser from '../../../schema/public-user'

const User = () => {
  const { uid } = useParams()
  const queryFn = async () => {
    if (!uid) return
    const docRef = doc(db, 'public/v1/users', uid)
    const userDoc = await getDoc(docRef)
    const data = userDoc.data()
    if (!data) return
    const res: PublicUser = {
      bio: data.bio,
      blockCount: data.blockCount,
      ethAddress: data.ethAddress,
      followerCount: data.followerCount,
      followingCount: data.followingCount,
      isNFTicon: data.isNFTicon,
      isOfficial: data.isOfficial,
      isSuspended: data.isSuspended,
      muteCount: data.muteCount,
      postCount: data.postCount,
      reportCount: data.reportCount,
      uid: data.uid,
      image: data.image,
      userName: data.userName,
    }
    return res
  }
  const { data, isPending, error } = useQuery({
    queryKey: ['user'],
    queryFn: queryFn,
  })
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>ユーザーが存在しません</div>
  if (error) return <div>{error.message}</div>
  const userData: PublicUser = data
  return (
    <div>
      <h3>ユーザー名: {userData?.userName.value ?? ''}</h3>
      <p>自己紹介: {userData?.bio.value ?? ''}</p>
      <p>フォロワー数: {userData?.followerCount ?? 0}</p>
      <p>フォロー数: {userData?.followingCount ?? 0}</p>
      <Link to="posts">
        <button className="text-white">投稿一覧</button>
      </Link>
    </div>
  )
}

export default User
