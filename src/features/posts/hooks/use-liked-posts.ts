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
  const initializedRef = useRef(false)

  const queryFn = async () => {
    if (!authState?.uid) return []
    return await postLikeRepository.getLikedPosts(authState.uid)
  }

  const { data: likedPostIds, isLoading, error } = useQuery({
    queryKey: ['liked-posts', authState?.uid],
    queryFn: queryFn,
    enabled: !!authState?.uid,
  })

  // Initialize the post like state when data is loaded (only once)
  useEffect(() => {
    if (likedPostIds && !initializedRef.current) {
      initializePostLikeState(likedPostIds)
      initializedRef.current = true
    }
  }, [likedPostIds, initializePostLikeState])

  return {
    likedPostIds: likedPostIds || [],
    isLoading,
    error,
  }
}