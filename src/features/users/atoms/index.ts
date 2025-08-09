import { atom } from 'jotai'

export interface FollowState {
  followingUsers: Set<string>
  loadingFollowActions: Set<string>
  followCounts: Record<string, { followers: number; following: number }>
}

export const followStateAtom = atom<FollowState>({
  followingUsers: new Set(),
  loadingFollowActions: new Set(),
  followCounts: {},
})

// Action atoms
export const addFollowingUserAtom = atom(null, (get, set, userId: string) => {
  const current = get(followStateAtom)
  const newFollowingUsers = new Set(current.followingUsers)
  newFollowingUsers.add(userId)
  set(followStateAtom, {
    ...current,
    followingUsers: newFollowingUsers,
  })
})

export const removeFollowingUserAtom = atom(
  null,
  (get, set, userId: string) => {
    const current = get(followStateAtom)
    const newFollowingUsers = new Set(current.followingUsers)
    newFollowingUsers.delete(userId)
    set(followStateAtom, {
      ...current,
      followingUsers: newFollowingUsers,
    })
  }
)

export const setFollowingUsersAtom = atom(
  null,
  (get, set, userIds: string[]) => {
    const current = get(followStateAtom)
    set(followStateAtom, {
      ...current,
      followingUsers: new Set(userIds),
    })
  }
)

export const setLoadingFollowActionAtom = atom(
  null,
  (get, set, userId: string, isLoading: boolean) => {
    const current = get(followStateAtom)
    const newLoadingActions = new Set(current.loadingFollowActions)

    if (isLoading) {
      newLoadingActions.add(userId)
    } else {
      newLoadingActions.delete(userId)
    }

    set(followStateAtom, {
      ...current,
      loadingFollowActions: newLoadingActions,
    })
  }
)

export const updateFollowCountAtom = atom(
  null,
  (
    get,
    set,
    userId: string,
    type: 'follow' | 'unfollow',
    countType: 'followers' | 'following'
  ) => {
    const current = get(followStateAtom)
    const currentCounts = current.followCounts[userId] || {
      followers: 0,
      following: 0,
    }
    const increment = type === 'follow' ? 1 : -1

    set(followStateAtom, {
      ...current,
      followCounts: {
        ...current.followCounts,
        [userId]: {
          ...currentCounts,
          [countType]: Math.max(0, currentCounts[countType] + increment),
        },
      },
    })
  }
)

export const setFollowCountsAtom = atom(
  null,
  (get, set, userId: string, followers: number, following: number) => {
    const current = get(followStateAtom)
    set(followStateAtom, {
      ...current,
      followCounts: {
        ...current.followCounts,
        [userId]: { followers, following },
      },
    })
  }
)

// Selector atoms
export const isFollowingAtom = atom(get => (userId: string) => {
  const { followingUsers } = get(followStateAtom)
  return followingUsers.has(userId)
})

export const isLoadingFollowActionAtom = atom(get => (userId: string) => {
  const { loadingFollowActions } = get(followStateAtom)
  return loadingFollowActions.has(userId)
})

export const getFollowCountsAtom = atom(get => (userId: string) => {
  const { followCounts } = get(followStateAtom)
  return followCounts[userId] || { followers: 0, following: 0 }
})
