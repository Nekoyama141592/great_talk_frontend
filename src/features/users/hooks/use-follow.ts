import { useAtom, useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import { UserRepository } from '../repositories/user-repository'
import {
  addFollowingUserAtom,
  removeFollowingUserAtom,
  setLoadingFollowActionAtom,
  updateFollowCountAtom,
  isFollowingAtom,
  isLoadingFollowActionAtom,
} from '../atoms'

const userRepository = new UserRepository()

export const useFollow = () => {
  const currentUserId = useAtomValue(uidAtom)
  const [, addFollowingUser] = useAtom(addFollowingUserAtom)
  const [, removeFollowingUser] = useAtom(removeFollowingUserAtom)
  const [, setLoadingFollowAction] = useAtom(setLoadingFollowActionAtom)
  const [, updateFollowCount] = useAtom(updateFollowCountAtom)
  const isFollowing = useAtomValue(isFollowingAtom)
  const isLoadingFollowAction = useAtomValue(isLoadingFollowActionAtom)

  const followUser = async (targetUserId: string) => {
    if (!currentUserId || currentUserId === targetUserId) return

    setLoadingFollowAction(targetUserId, true)
    
    // Optimistic update
    addFollowingUser(targetUserId)
    updateFollowCount(targetUserId, 'follow', 'followers')
    updateFollowCount(currentUserId, 'follow', 'following')

    try {
      const result = await userRepository.followUser(currentUserId, targetUserId)
      
      if (!result.success) {
        // Rollback on error
        removeFollowingUser(targetUserId)
        updateFollowCount(targetUserId, 'unfollow', 'followers')
        updateFollowCount(currentUserId, 'unfollow', 'following')
        
        throw new Error(result.error || 'フォローに失敗しました')
      }
    } catch (error) {
      console.error('Follow error:', error)
      
      // Rollback optimistic updates
      removeFollowingUser(targetUserId)
      updateFollowCount(targetUserId, 'unfollow', 'followers')
      updateFollowCount(currentUserId, 'unfollow', 'following')
      
      throw error
    } finally {
      setLoadingFollowAction(targetUserId, false)
    }
  }

  const unfollowUser = async (targetUserId: string) => {
    if (!currentUserId || currentUserId === targetUserId) return

    setLoadingFollowAction(targetUserId, true)
    
    // Optimistic update
    removeFollowingUser(targetUserId)
    updateFollowCount(targetUserId, 'unfollow', 'followers')
    updateFollowCount(currentUserId, 'unfollow', 'following')

    try {
      const result = await userRepository.unfollowUser(currentUserId, targetUserId)
      
      if (!result.success) {
        // Rollback on error
        addFollowingUser(targetUserId)
        updateFollowCount(targetUserId, 'follow', 'followers')
        updateFollowCount(currentUserId, 'follow', 'following')
        
        throw new Error(result.error || 'アンフォローに失敗しました')
      }
    } catch (error) {
      console.error('Unfollow error:', error)
      
      // Rollback optimistic updates
      addFollowingUser(targetUserId)
      updateFollowCount(targetUserId, 'follow', 'followers')
      updateFollowCount(currentUserId, 'follow', 'following')
      
      throw error
    } finally {
      setLoadingFollowAction(targetUserId, false)
    }
  }

  const toggleFollow = async (targetUserId: string) => {
    if (isFollowing(targetUserId)) {
      await unfollowUser(targetUserId)
    } else {
      await followUser(targetUserId)
    }
  }

  return {
    followUser,
    unfollowUser,
    toggleFollow,
    isFollowing,
    isLoadingFollowAction,
  }
}