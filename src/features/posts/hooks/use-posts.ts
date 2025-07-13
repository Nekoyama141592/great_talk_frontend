import { useQuery } from '@tanstack/react-query'
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'

export type PostSortType = 'popularity' | 'newest'

export const usePosts = (sortType: PostSortType = 'popularity') => {
  const queryFn = async () => {
    const colRef = collectionGroup(db, `posts`)

    // Configure sorting based on the selected sort type
    const orderField = sortType === 'popularity' ? 'msgCount' : 'createdAt'
    const orderDirection = 'desc' // Both popularity and newest should be descending

    const q = query(colRef, orderBy(orderField, orderDirection), limit(30))
    const querySnapshot = await getDocs(q)

    const postsData: PublicPost[] = querySnapshot.docs.map(doc => {
      const docData = doc.data()
      return {
        customCompleteText: docData.customCompleteText,
        description: docData.description,
        image: docData.image,
        msgCount: docData.msgCount,
        uid: docData.uid,
        postId: docData.postId,
        title: docData.title,
        createdAt: docData.createdAt,
      }
    })
    return postsData
  }

  return useQuery({
    queryKey: ['posts', sortType],
    queryFn: queryFn,
  })
}
