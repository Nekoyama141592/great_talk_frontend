import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import { UserRepository } from '../repositories/user-repository'
import { setFollowingUsersAtom } from '../atoms'

const userRepository = new UserRepository()

export const useFollowingUsers = () => {
  const currentUserId = useAtomValue(uidAtom)
  const [, setFollowingUsers] = useAtom(setFollowingUsersAtom)

  const {
    data: followingUserIds = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['followingUsers', currentUserId],
    queryFn: () =>
      currentUserId
        ? userRepository.getFollowing(currentUserId)
        : Promise.resolve([]),
    enabled: !!currentUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Update atom when data changes
  useEffect(() => {
    if (followingUserIds) {
      setFollowingUsers(followingUserIds)
    }
  }, [followingUserIds, setFollowingUsers])

  return {
    followingUserIds,
    isLoading,
    error,
    refetch,
  }
}
