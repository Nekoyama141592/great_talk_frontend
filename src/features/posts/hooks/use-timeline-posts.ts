import { useInfiniteQuery } from '@tanstack/react-query'
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'

const POSTS_PER_PAGE = 10

interface TimelineEntry {
  postId: string
  posterUid: string
  createdAt: any
  isRead: boolean
}

export const useTimelinePosts = (enabled: boolean = true) => {
  const [authState] = useAtom(authAtom)
  const currentUserId = authState?.uid

  const queryFn = async ({ pageParam }: { pageParam?: DocumentSnapshot }) => {
    if (!currentUserId) {
      return { posts: [], lastDoc: null, hasMore: false }
    }

    // Get user's timeline entries
    const timelineColRef = collection(
      db,
      'public',
      'v1',
      'users',
      currentUserId,
      'timelines'
    )
    let timelineQuery = query(
      timelineColRef,
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    )

    if (pageParam) {
      timelineQuery = query(timelineQuery, startAfter(pageParam))
    }

    const timelineSnapshot = await getDocs(timelineQuery)
    const timelineEntries: TimelineEntry[] = timelineSnapshot.docs.map(doc => ({
      postId: doc.data().postId,
      posterUid: doc.data().posterUid,
      createdAt: doc.data().createdAt,
      isRead: doc.data().isRead || false,
    }))

    if (timelineEntries.length === 0) {
      return { posts: [], lastDoc: null, hasMore: false }
    }

    // Fetch the actual posts
    const postsPromises = timelineEntries.map(async entry => {
      try {
        const postRef = doc(
          db,
          'public',
          'v1',
          'users',
          entry.posterUid,
          'posts',
          entry.postId
        )
        const postDoc = await getDoc(postRef)

        if (postDoc.exists()) {
          const postData = postDoc.data()
          return {
            customCompleteText: postData.customCompleteText,
            description: postData.description,
            image: postData.image,
            msgCount: postData.msgCount,
            likeCount: postData.likeCount || 0,
            uid: postData.uid,
            postId: postData.postId,
            title: postData.title,
            createdAt: postData.createdAt,
          } as PublicPost
        }
        return null
      } catch (error) {
        console.error('Error fetching post:', error)
        return null
      }
    })

    const posts = (await Promise.all(postsPromises)).filter(
      post => post !== null
    ) as PublicPost[]

    return {
      posts,
      lastDoc: timelineSnapshot.docs[timelineSnapshot.docs.length - 1],
      hasMore: timelineSnapshot.docs.length === POSTS_PER_PAGE,
    }
  }

  return useInfiniteQuery({
    queryKey: ['timeline-posts', currentUserId],
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: lastPage => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
    enabled: !!currentUserId && enabled,
  })
}
