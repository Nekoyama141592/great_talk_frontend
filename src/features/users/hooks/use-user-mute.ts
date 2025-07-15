import { useAtom, useAtomValue } from 'jotai'
import { authAtom } from '@auth/atoms'
import { UserMuteRepository } from '../repositories/user-mute-repository'
import {
  userMuteStateAtom,
  addMuteUserAtom,
  removeMuteUserAtom,
  setUserMuteLoadingAtom,
  isUserMutedAtom,
  isUserMuteLoadingAtom,
  initializeMuteUserTokensAtom,
} from '../atoms/user-mute-atoms'
import { MuteUserTokenEntity } from '@shared/schema/user-mute'

const userMuteRepository = new UserMuteRepository()

export const useUserMute = () => {
  const [authState] = useAtom(authAtom)
  const [, addMuteUser] = useAtom(addMuteUserAtom)
  const [, removeMuteUser] = useAtom(removeMuteUserAtom)
  const [, setLoading] = useAtom(setUserMuteLoadingAtom)
  const [, initializeTokens] = useAtom(initializeMuteUserTokensAtom)
  const muteState = useAtomValue(userMuteStateAtom)

  const currentUserId = authState?.uid

  // ユーザーをミュートする
  const muteUser = async (passiveUserId: string): Promise<boolean> => {
    if (!currentUserId) {
      console.warn('User must be authenticated to mute users')
      return false
    }

    if (currentUserId === passiveUserId) {
      console.warn('Cannot mute self')
      return false
    }

    setLoading(passiveUserId, true)

    try {
      // 楽観的アップデート
      const tempToken: MuteUserTokenEntity = {
        activeUid: currentUserId,
        passiveUid: passiveUserId,
        tokenId: 'temp-' + Date.now(), // 一時的なID
      }
      addMuteUser(tempToken)

      const result = await userMuteRepository.muteUser(
        currentUserId,
        passiveUserId
      )

      if (result.success && result.tokenId) {
        // 成功時に正しいトークンIDで更新
        removeMuteUser(passiveUserId) // 一時的なトークンを削除
        const finalToken: MuteUserTokenEntity = {
          activeUid: currentUserId,
          passiveUid: passiveUserId,
          tokenId: result.tokenId,
        }
        addMuteUser(finalToken)
        return true
      } else {
        // 失敗時は楽観的アップデートを取り消し（リトライしない）
        removeMuteUser(passiveUserId)
        console.error('Failed to mute user (no retry):', result.error)
        return false
      }
    } catch (error) {
      // エラー時は楽観的アップデートを取り消し（リトライしない）
      removeMuteUser(passiveUserId)
      console.error('Error muting user (no retry):', error)
      return false
    } finally {
      setLoading(passiveUserId, false)
    }
  }

  // ユーザーのミュートを解除する
  const unmuteUser = async (passiveUserId: string): Promise<boolean> => {
    if (!currentUserId) {
      console.warn('User must be authenticated to unmute users')
      return false
    }

    // ミュートトークンを検索
    const muteToken = muteState.muteUserTokens.find(
      token => token.passiveUid === passiveUserId
    )
    if (!muteToken) {
      console.warn('Mute token not found for user:', passiveUserId)
      return false
    }

    setLoading(passiveUserId, true)

    try {
      // 楽観的アップデート
      removeMuteUser(passiveUserId)

      const result = await userMuteRepository.unmuteUser(
        currentUserId,
        passiveUserId,
        muteToken.tokenId
      )

      if (!result.success) {
        // 失敗時は楽観的アップデートを取り消し
        addMuteUser(muteToken)
        console.error('Failed to unmute user:', result.error)
        return false
      }

      return true
    } catch (error) {
      // エラー時は楽観的アップデートを取り消し
      addMuteUser(muteToken)
      console.error('Error unmuting user:', error)
      return false
    } finally {
      setLoading(passiveUserId, false)
    }
  }

  // ミュート状態をトグルする
  const toggleMute = async (passiveUserId: string): Promise<boolean> => {
    const isMuted = muteState.muteUserTokens.some(
      token => token.passiveUid === passiveUserId
    )
    return isMuted ? unmuteUser(passiveUserId) : muteUser(passiveUserId)
  }

  // ユーザーがミュートされているかチェック
  const isUserMuted = (userId: string): boolean => {
    return muteState.muteUserTokens.some(token => token.passiveUid === userId)
  }

  // ユーザーがミュート処理中かチェック
  const isUserMuteLoading = (userId: string): boolean => {
    return muteState.loadingUserIds.includes(userId)
  }

  // ユーザーのミュートユーザートークンを初期化（リトライなし）
  const initializeMuteTokens = async (): Promise<void> => {
    if (!currentUserId) return

    try {
      const tokens = await userMuteRepository.getMuteUserTokens(currentUserId)
      initializeTokens(tokens)
    } catch (error) {
      console.error('Error initializing user mute tokens (no retry):', error)
      // エラーが発生した場合、空の状態で初期化する（リトライしない）
      initializeTokens([])
    }
  }

  return {
    muteUser,
    unmuteUser,
    toggleMute,
    isUserMuted,
    isUserMuteLoading,
    initializeMuteTokens,
    muteUserTokens: muteState.muteUserTokens,
    muteUserIds: muteState.muteUserTokens.map(token => token.passiveUid),
  }
}

// 特定のユーザーのミュート状態をチェックするためのカスタムhook
export const useIsUserMuted = (userId: string) => {
  return useAtomValue(isUserMutedAtom(userId))
}

// 特定のユーザーのミュート処理中状態をチェックするためのカスタムhook
export const useIsUserMuteLoading = (userId: string) => {
  return useAtomValue(isUserMuteLoadingAtom(userId))
}
