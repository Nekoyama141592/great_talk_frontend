import { atom } from 'jotai'
import { MutePostTokenEntity } from '@shared/schema/post-mute'

// ミュート状態管理の型定義
export interface PostMuteState {
  mutePostTokens: MutePostTokenEntity[]
  loadingPostIds: string[] // ミュート処理中の投稿ID
}

// 初期状態
const initialPostMuteState: PostMuteState = {
  mutePostTokens: [],
  loadingPostIds: [],
}

// ベースのミュート状態atom
export const postMuteStateAtom = atom<PostMuteState>(initialPostMuteState)

// ミュート投稿IDリストを取得
export const mutePostIdsAtom = atom((get) => {
  const state = get(postMuteStateAtom)
  return state.mutePostTokens.map(token => token.postId)
})

// atom のキャッシュを作成して無限レンダリングを防ぐ
const postMutedAtomCache = new Map<string, any>()
const postMuteLoadingAtomCache = new Map<string, any>()

// 特定の投稿がミュートされているかチェック
export const isPostMutedAtom = (postId: string) => {
  if (!postMutedAtomCache.has(postId)) {
    postMutedAtomCache.set(postId, atom((get) => {
      const mutePostIds = get(mutePostIdsAtom)
      return mutePostIds.includes(postId)
    }))
  }
  return postMutedAtomCache.get(postId)
}

// 特定の投稿がミュート処理中かチェック
export const isPostMuteLoadingAtom = (postId: string) => {
  if (!postMuteLoadingAtomCache.has(postId)) {
    postMuteLoadingAtomCache.set(postId, atom((get) => {
      const state = get(postMuteStateAtom)
      return state.loadingPostIds.includes(postId)
    }))
  }
  return postMuteLoadingAtomCache.get(postId)
}

// ミュート追加のwrite-only atom
export const addMutePostAtom = atom(
  null,
  (get, set, token: MutePostTokenEntity) => {
    const current = get(postMuteStateAtom)
    const exists = current.mutePostTokens.some(t => t.postId === token.postId)
    
    if (!exists) {
      set(postMuteStateAtom, {
        ...current,
        mutePostTokens: [...current.mutePostTokens, token],
      })
    }
  }
)

// ミュート削除のwrite-only atom
export const removeMutePostAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(postMuteStateAtom)
    set(postMuteStateAtom, {
      ...current,
      mutePostTokens: current.mutePostTokens.filter(token => token.postId !== postId),
    })
  }
)

// ローディング状態設定のwrite-only atom
export const setPostMuteLoadingAtom = atom(
  null,
  (get, set, postId: string, isLoading: boolean) => {
    const current = get(postMuteStateAtom)
    const loadingPostIds = isLoading
      ? [...current.loadingPostIds, postId]
      : current.loadingPostIds.filter(id => id !== postId)
    
    set(postMuteStateAtom, {
      ...current,
      loadingPostIds,
    })
  }
)

// ミュートトークンリストを初期化するwrite-only atom
export const initializeMutePostTokensAtom = atom(
  null,
  (get, set, tokens: MutePostTokenEntity[]) => {
    set(postMuteStateAtom, {
      mutePostTokens: tokens,
      loadingPostIds: [],
    })
  }
)