import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { PostLikeRepository } from '../repositories/post-like-repository'
import { authAtom } from '@auth/atoms'
import { initializePostLikeStateAtom } from '../atoms'

const postLikeRepository = new PostLikeRepository()

export const useLikedPosts = () => {
  const [authState] = useAtom(authAtom)
  const [, initializePostLikeState] = useAtom(initializePostLikeStateAtom)
  const initializedRef = useRef<string | null>(null)

  const queryFn = async () => {
    if (!authState?.uid) return []
    return await postLikeRepository.getLikedPosts(authState.uid)
  }

  const {
    data: likedPostIds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['liked-posts', authState?.uid],
    queryFn: queryFn,
    enabled: !!authState?.uid,
  })

  // Initialize the post like state when data is loaded
  useEffect(() => {
    if (
      likedPostIds &&
      authState?.uid &&
      initializedRef.current !== authState.uid
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Initializing liked posts state:', likedPostIds)
      }
      initializePostLikeState(likedPostIds)
      initializedRef.current = authState.uid
    }
  }, [likedPostIds, authState?.uid, initializePostLikeState])

  // Clear state when user logs out
  useEffect(() => {
    if (!authState?.uid && initializedRef.current) {
      initializePostLikeState([])
      initializedRef.current = null
    }
  }, [authState?.uid, initializePostLikeState])

  return {
    likedPostIds: likedPostIds || [],
    isLoading,
    error,
  }
}
