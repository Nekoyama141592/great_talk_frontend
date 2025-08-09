import { useAtom, useAtomValue } from 'jotai'
import { authAtom } from '@auth/atoms'
import { PostMuteRepository } from '../repositories/post-mute-repository'
import {
  postMuteStateAtom,
  addMutePostAtom,
  removeMutePostAtom,
  setPostMuteLoadingAtom,
  isPostMutedAtom,
  isPostMuteLoadingAtom,
  initializeMutePostTokensAtom,
} from '../atoms/mute-atoms'
import { MutePostTokenEntity } from '@shared/schema/post-mute'

const postMuteRepository = new PostMuteRepository()

export const usePostMute = () => {
  const [authState] = useAtom(authAtom)
  const [, addMutePost] = useAtom(addMutePostAtom)
  const [, removeMutePost] = useAtom(removeMutePostAtom)
  const [, setLoading] = useAtom(setPostMuteLoadingAtom)
  const [, initializeTokens] = useAtom(initializeMutePostTokensAtom)
  const muteState = useAtomValue(postMuteStateAtom)

  const currentUserId = authState?.uid

  // 投稿をミュートする
  const mutePost = async (
    postUid: string,
    postId: string
  ): Promise<boolean> => {
    if (!currentUserId) {
      console.warn('User must be authenticated to mute posts')
      return false
    }

    setLoading(postId, true)

    try {
      // 楽観的アップデート
      const tempToken: MutePostTokenEntity = {
        activeUid: currentUserId,
        postId,
        tokenId: 'temp-' + Date.now(), // 一時的なID
      }
      addMutePost(tempToken)

      const result = await postMuteRepository.mutePost(
        currentUserId,
        postUid,
        postId
      )

      if (result.success && result.tokenId) {
        // 成功時に正しいトークンIDで更新
        removeMutePost(postId) // 一時的なトークンを削除
        const finalToken: MutePostTokenEntity = {
          activeUid: currentUserId,
          postId,
          tokenId: result.tokenId,
        }
        addMutePost(finalToken)
        return true
      } else {
        // 失敗時は楽観的アップデートを取り消し（リトライしない）
        removeMutePost(postId)
        console.error('Failed to mute post (no retry):', result.error)
        return false
      }
    } catch (error) {
      // エラー時は楽観的アップデートを取り消し（リトライしない）
      removeMutePost(postId)
      console.error('Error muting post (no retry):', error)
      return false
    } finally {
      setLoading(postId, false)
    }
  }

  // 投稿のミュートを解除する
  const unmutePost = async (
    postUid: string,
    postId: string
  ): Promise<boolean> => {
    if (!currentUserId) {
      console.warn('User must be authenticated to unmute posts')
      return false
    }

    // ミュートトークンを検索
    const muteToken = muteState.mutePostTokens.find(
      token => token.postId === postId
    )
    if (!muteToken) {
      console.warn('Mute token not found for post:', postId)
      return false
    }

    setLoading(postId, true)

    try {
      // 楽観的アップデート
      removeMutePost(postId)

      const result = await postMuteRepository.unmutePost(
        currentUserId,
        postUid,
        postId,
        muteToken.tokenId
      )

      if (!result.success) {
        // 失敗時は楽観的アップデートを取り消し
        addMutePost(muteToken)
        console.error('Failed to unmute post:', result.error)
        return false
      }

      return true
    } catch (error) {
      // エラー時は楽観的アップデートを取り消し
      addMutePost(muteToken)
      console.error('Error unmuting post:', error)
      return false
    } finally {
      setLoading(postId, false)
    }
  }

  // ミュート状態をトグルする
  const toggleMute = async (
    postUid: string,
    postId: string
  ): Promise<boolean> => {
    const isMuted = muteState.mutePostTokens.some(
      token => token.postId === postId
    )
    return isMuted ? unmutePost(postUid, postId) : mutePost(postUid, postId)
  }

  // 投稿がミュートされているかチェック
  const isPostMuted = (postId: string): boolean => {
    return muteState.mutePostTokens.some(token => token.postId === postId)
  }

  // 投稿がミュート処理中かチェック
  const isPostMuteLoading = (postId: string): boolean => {
    return muteState.loadingPostIds.includes(postId)
  }

  // ユーザーのミュート投稿トークンを初期化（リトライなし）
  const initializeMuteTokens = async (): Promise<void> => {
    if (!currentUserId) return

    try {
      const tokens = await postMuteRepository.getMutePostTokens(currentUserId)
      initializeTokens(tokens)
    } catch (error) {
      console.error('Error initializing mute tokens (no retry):', error)
      // エラーが発生した場合、空の状態で初期化する（リトライしない）
      initializeTokens([])
    }
  }

  return {
    mutePost,
    unmutePost,
    toggleMute,
    isPostMuted,
    isPostMuteLoading,
    initializeMuteTokens,
    mutePostTokens: muteState.mutePostTokens,
    mutePostIds: muteState.mutePostTokens.map(token => token.postId),
  }
}

// 特定の投稿のミュート状態をチェックするためのカスタムhook
export const useIsPostMuted = (postId: string) => {
  return useAtomValue(isPostMutedAtom(postId))
}

// 特定の投稿のミュート処理中状態をチェックするためのカスタムhook
export const useIsPostMuteLoading = (postId: string) => {
  return useAtomValue(isPostMuteLoadingAtom(postId))
}
