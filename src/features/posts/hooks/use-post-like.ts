import { useState } from 'react'
import { useAtom } from 'jotai'
import { PostLikeRepository } from '../repositories/post-like-repository'
import { authAtom } from '@auth/atoms'
import { postLikeStateAtom, addPostLikeAtom, removePostLikeAtom, resetPostLikeCountDeltaAtom } from '../atoms'

const postLikeRepository = new PostLikeRepository()

export const usePostLike = () => {
  const [authState] = useAtom(authAtom)
  const [postLikeState] = useAtom(postLikeStateAtom)
  const [, addPostLike] = useAtom(addPostLikeAtom)
  const [, removePostLike] = useAtom(removePostLikeAtom)
  const [, resetPostLikeCountDelta] = useAtom(resetPostLikeCountDeltaAtom)
  const [isLoading, setIsLoading] = useState(false)

  const likePost = async (targetUserId: string, postId: string) => {
    if (!authState?.uid || isLoading) return

    setIsLoading(true)
    
    // Optimistic update
    addPostLike(postId)

    try {
      const result = await postLikeRepository.likePost(
        authState.uid,
        targetUserId,
        postId
      )

      if (!result.success) {
        // Revert optimistic update on failure
        removePostLike(postId)
        console.error('Failed to like post:', result.error)
      } else {
        // Success: reset the delta since the optimistic update is now permanent
        resetPostLikeCountDelta(postId)
      }
    } catch (error) {
      // Revert optimistic update on error
      removePostLike(postId)
      console.error('Error liking post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const unlikePost = async (targetUserId: string, postId: string) => {
    if (!authState?.uid || isLoading) return

    setIsLoading(true)
    
    // Optimistic update
    removePostLike(postId)

    try {
      const result = await postLikeRepository.unlikePost(
        authState.uid,
        targetUserId,
        postId
      )

      if (!result.success) {
        // Revert optimistic update on failure
        addPostLike(postId)
        console.error('Failed to unlike post:', result.error)
      } else {
        // Success: reset the delta since the optimistic update is now permanent
        resetPostLikeCountDelta(postId)
      }
    } catch (error) {
      // Revert optimistic update on error
      addPostLike(postId)
      console.error('Error unliking post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePostLike = async (targetUserId: string, postId: string) => {
    const isLiked = postLikeState.likedPostIds.includes(postId)
    
    if (isLiked) {
      await unlikePost(targetUserId, postId)
    } else {
      await likePost(targetUserId, postId)
    }
  }

  const isPostLiked = (postId: string) => {
    return postLikeState.likedPostIds.includes(postId)
  }

  return {
    likePost,
    unlikePost,
    togglePostLike,
    isPostLiked,
    isLoading,
  }
}