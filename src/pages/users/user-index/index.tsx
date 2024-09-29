import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../../../infrastructures/firebase'
import PublicUser from '../../../schema/public-user'

function UserIndex() {
  const [users, setUsers] = useState<PublicUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const cacheKey = 'users_cache'
        const cachedData = localStorage.getItem(cacheKey)
        const cacheTime = localStorage.getItem(`${cacheKey}_time`)
        const now = new Date().getTime()

        if (cachedData && cacheTime && now - parseInt(cacheTime) < 3600000) {
          setUsers(JSON.parse(cachedData))
        } else {
          const colRef = collection(db, `public/v1/users`)
          const q = query(colRef, orderBy('followerCount', 'desc'), limit(30))
          const querySnapshot = await getDocs(q)

          const usersData: PublicUser[] = querySnapshot.docs.map((doc) => {
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
          setUsers(usersData)
          localStorage.setItem(cacheKey, JSON.stringify(usersData))
          localStorage.setItem(`${cacheKey}_time`, now.toString())
        }
      } catch (err) {
        setError(err?.toString() ?? 'ERROR')
      }
    }

    fetchUsers()
  }, [])

  if (error) return <div>{error}</div>
  if (!users) return <div>読み込み中...</div>
  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.uid}
          className="border-2 rounded-full border-white hover:border-emerald-500 p-8 m-8"
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

export default UserIndex
