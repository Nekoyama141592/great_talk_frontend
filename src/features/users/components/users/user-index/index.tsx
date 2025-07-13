import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicUser } from '@shared/schema/public-user'
import { useQuery } from '@tanstack/react-query'
export const UserIndexComponent = () => {
  const queryFn = async () => {
    const colRef = collection(db, `public/v1/users`)
    const q = query(colRef, orderBy('followerCount', 'desc'), limit(30))
    const querySnapshot = await getDocs(q)

    const usersData: PublicUser[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
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
    })
    return usersData
  }
  const { data, isPending, error } = useQuery({
    queryKey: ['users'],
    queryFn: queryFn,
  })
  if (error) return <div>{error.message}</div>
  if (isPending) return <div>読み込み中...</div>
  if (!data) return <div>データがありません</div>
  const users: PublicUser[] = data
  return (
    <ul>
      {users.map(user => (
        <li
          key={user.uid}
          className='border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8'
        >
          <Link to={`/users/${user.uid}`}>
            <p>{user.userName.value}</p>
            <p>{user.bio.value}</p>
            <p>{user.followerCount}フォロワー</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
