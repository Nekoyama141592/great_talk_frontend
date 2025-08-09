import { atom } from 'jotai'
import { MuteUserTokenEntity, UserMuteState } from '@shared/schema/user-mute'

// 初期状態
const initialUserMuteState: UserMuteState = {
  muteUserTokens: [],
  loadingUserIds: [],
}

// ベースのユーザーミュート状態atom
export const userMuteStateAtom = atom<UserMuteState>(initialUserMuteState)

// ミュートユーザーIDリストを取得
export const muteUserIdsAtom = atom(get => {
  const state = get(userMuteStateAtom)
  return state.muteUserTokens.map(token => token.passiveUid)
})

// atom のキャッシュを作成して無限レンダリングを防ぐ
const userMutedAtomCache = new Map<string, any>()
const userMuteLoadingAtomCache = new Map<string, any>()

// 特定のユーザーがミュートされているかチェック
export const isUserMutedAtom = (userId: string) => {
  if (!userMutedAtomCache.has(userId)) {
    userMutedAtomCache.set(
      userId,
      atom(get => {
        const muteUserIds = get(muteUserIdsAtom)
        return muteUserIds.includes(userId)
      })
    )
  }
  return userMutedAtomCache.get(userId)
}

// 特定のユーザーがミュート処理中かチェック
export const isUserMuteLoadingAtom = (userId: string) => {
  if (!userMuteLoadingAtomCache.has(userId)) {
    userMuteLoadingAtomCache.set(
      userId,
      atom(get => {
        const state = get(userMuteStateAtom)
        return state.loadingUserIds.includes(userId)
      })
    )
  }
  return userMuteLoadingAtomCache.get(userId)
}

// ユーザーミュート追加のwrite-only atom
export const addMuteUserAtom = atom(
  null,
  (get, set, token: MuteUserTokenEntity) => {
    const current = get(userMuteStateAtom)
    const exists = current.muteUserTokens.some(
      t => t.passiveUid === token.passiveUid
    )

    if (!exists) {
      set(userMuteStateAtom, {
        ...current,
        muteUserTokens: [...current.muteUserTokens, token],
      })
    }
  }
)

// ユーザーミュート削除のwrite-only atom
export const removeMuteUserAtom = atom(null, (get, set, passiveUid: string) => {
  const current = get(userMuteStateAtom)
  set(userMuteStateAtom, {
    ...current,
    muteUserTokens: current.muteUserTokens.filter(
      token => token.passiveUid !== passiveUid
    ),
  })
})

// ローディング状態設定のwrite-only atom
export const setUserMuteLoadingAtom = atom(
  null,
  (get, set, userId: string, isLoading: boolean) => {
    const current = get(userMuteStateAtom)
    const loadingUserIds = isLoading
      ? [...current.loadingUserIds, userId]
      : current.loadingUserIds.filter(id => id !== userId)

    set(userMuteStateAtom, {
      ...current,
      loadingUserIds,
    })
  }
)

// ユーザーミュートトークンリストを初期化するwrite-only atom
export const initializeMuteUserTokensAtom = atom(
  null,
  (_get, set, tokens: MuteUserTokenEntity[]) => {
    set(userMuteStateAtom, {
      muteUserTokens: tokens,
      loadingUserIds: [],
    })
  }
)
