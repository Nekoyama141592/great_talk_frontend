import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  Unsubscribe
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'
import { useQueryClient } from '@tanstack/react-query'

const INITIAL_LIMIT = 20

interface TimelineEntry {
  postId: string
  posterUid: string
  createdAt: any
  isRead: boolean
}

export const useRealtimeTimeline = () => {
  const [authState] = useAtom(authAtom)
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const currentUserId = authState?.uid

  useEffect(() => {
    if (!currentUserId) {
      setPosts([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const timelineColRef = collection(db, 'public', 'v1', 'users', currentUserId, 'timelines')
    const timelineQuery = query(
      timelineColRef,
      orderBy('createdAt', 'desc'),
      limit(INITIAL_LIMIT)
    )

    const unsubscribe: Unsubscribe = onSnapshot(
      timelineQuery,
      async (snapshot) => {
        try {
          const timelineEntries: TimelineEntry[] = snapshot.docs.map(doc => ({
            postId: doc.data().postId,
            posterUid: doc.data().posterUid,
            createdAt: doc.data().createdAt,
            isRead: doc.data().isRead || false
          }))

          if (timelineEntries.length === 0) {
            setPosts([])
            setLoading(false)
            return
          }

          // Fetch the actual posts with real-time updates
          const postsPromises = timelineEntries.map(async (entry) => {
            try {
              const postRef = doc(db, 'public', 'v1', 'users', entry.posterUid, 'posts', entry.postId)
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

          const fetchedPosts = (await Promise.all(postsPromises)).filter(post => post !== null) as PublicPost[]
          
          setPosts(fetchedPosts)
          setLoading(false)

          // Invalidate related queries to keep them in sync
          queryClient.invalidateQueries({ queryKey: ['timeline-posts', currentUserId] })
        } catch (err) {
          console.error('Error in timeline listener:', err)
          setError(err instanceof Error ? err.message : 'タイムラインの取得中にエラーが発生しました')
          setLoading(false)
        }
      },
      (err) => {
        console.error('Timeline listener error:', err)
        setError(err.message || 'リアルタイム更新でエラーが発生しました')
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [currentUserId, queryClient])

  const markAsRead = async (postId: string) => {
    if (!currentUserId) return
    
    try {
      // Note: In a real implementation, you'd use updateDoc here
      // For now, we'll just update the local state
      setPosts(prev => prev.map(post => 
        post.postId === postId 
          ? { ...post, isRead: true } as PublicPost & { isRead: boolean }
          : post
      ))
    } catch (error) {
      console.error('Error marking post as read:', error)
    }
  }

  return {
    posts,
    loading,
    error,
    markAsRead,
    hasNewPosts: posts.some(post => !(post as any).isRead),
    unreadCount: posts.filter(post => !(post as any).isRead).length
  }
}

export default useRealtimeTimeline