import { atom } from 'jotai'

// Post like state type
export interface PostLikeState {
  likedPostIds: string[]
  loadingPostIds: string[]
  likeCountDeltas: Record<string, number> // postId -> delta change in like count
}

// Initial state
const initialPostLikeState: PostLikeState = {
  likedPostIds: [],
  loadingPostIds: [],
  likeCountDeltas: {},
}

// Base atom for post like state
export const postLikeStateAtom = atom<PostLikeState>(initialPostLikeState)

// Write-only atom to add a post like
export const addPostLikeAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(postLikeStateAtom)
    if (!current.likedPostIds.includes(postId)) {
      set(postLikeStateAtom, {
        ...current,
        likedPostIds: [...current.likedPostIds, postId],
        likeCountDeltas: {
          ...current.likeCountDeltas,
          [postId]: (current.likeCountDeltas[postId] || 0) + 1,
        },
      })
    }
  }
)

// Write-only atom to remove a post like
export const removePostLikeAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(postLikeStateAtom)
    set(postLikeStateAtom, {
      ...current,
      likedPostIds: current.likedPostIds.filter(id => id !== postId),
      likeCountDeltas: {
        ...current.likeCountDeltas,
        [postId]: (current.likeCountDeltas[postId] || 0) - 1,
      },
    })
  }
)

// Write-only atom to set loading state for a post
export const setPostLikeLoadingAtom = atom(
  null,
  (get, set, postId: string, isLoading: boolean) => {
    const current = get(postLikeStateAtom)
    const loadingPostIds = isLoading
      ? [...current.loadingPostIds, postId]
      : current.loadingPostIds.filter(id => id !== postId)
    
    set(postLikeStateAtom, {
      ...current,
      loadingPostIds,
    })
  }
)

// Write-only atom to initialize post like state with user's liked posts
export const initializePostLikeStateAtom = atom(
  null,
  (get, set, likedPostIds: string[]) => {
    set(postLikeStateAtom, {
      likedPostIds,
      loadingPostIds: [],
      likeCountDeltas: {},
    })
  }
)

// Read-only atom to check if a specific post is liked
export const isPostLikedAtom = (postId: string) => atom(
  (get) => {
    const state = get(postLikeStateAtom)
    return state.likedPostIds.includes(postId)
  }
)

// Read-only atom to check if a specific post is loading
export const isPostLikeLoadingAtom = (postId: string) => atom(
  (get) => {
    const state = get(postLikeStateAtom)
    return state.loadingPostIds.includes(postId)
  }
)

// Write-only atom to reset like count delta for a specific post (when API call succeeds)
export const resetPostLikeCountDeltaAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(postLikeStateAtom)
    const { [postId]: removed, ...remainingDeltas } = current.likeCountDeltas
    set(postLikeStateAtom, {
      ...current,
      likeCountDeltas: remainingDeltas,
    })
  }
)