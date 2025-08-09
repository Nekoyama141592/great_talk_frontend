import { useInfiniteQuery } from '@tanstack/react-query'
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'

export type PostSortType = 'popularity' | 'newest'

const POSTS_PER_PAGE = 10

export const usePosts = (sortType: PostSortType = 'popularity') => {
  const queryFn = async ({ pageParam }: { pageParam?: DocumentSnapshot }) => {
    const colRef = collectionGroup(db, `posts`)

    // Configure sorting based on the selected sort type
    const orderField = sortType === 'popularity' ? 'msgCount' : 'createdAt'
    const orderDirection = 'desc' // Both popularity and newest should be descending

    let q = query(
      colRef,
      orderBy(orderField, orderDirection),
      limit(POSTS_PER_PAGE)
    )

    // Add pagination cursor if provided
    if (pageParam) {
      q = query(q, startAfter(pageParam))
    }

    const querySnapshot = await getDocs(q)

    const postsData: PublicPost[] = querySnapshot.docs.map(doc => {
      const docData = doc.data()
      return {
        customCompleteText: docData.customCompleteText,
        description: docData.description,
        image: docData.image,
        msgCount: docData.msgCount,
        likeCount: docData.likeCount || 0,
        uid: docData.uid,
        postId: docData.postId,
        title: docData.title,
        createdAt: docData.createdAt,
      }
    })

    return {
      posts: postsData,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === POSTS_PER_PAGE,
    }
  }

  return useInfiniteQuery({
    queryKey: ['posts', sortType],
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: lastPage => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
  })
}
