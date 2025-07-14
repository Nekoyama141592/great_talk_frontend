import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  where,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PostMute, MutePostToken, MutePostTokenEntity } from '@shared/schema/post-mute'
import { PublicPost } from '@shared/schema/public-post'

// ユニークなトークンIDを生成
const generateTokenId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export class PostMuteRepository {
  // 投稿をミュートする
  async mutePost(
    currentUserId: string,
    postUid: string,
    postId: string
  ): Promise<{ success: boolean; error?: string; tokenId?: string }> {
    try {
      const batch = writeBatch(db)
      const tokenId = generateTokenId()

      // トークンデータを作成
      const mutePostToken: MutePostToken = {
        activeUid: currentUserId,
        createdAt: serverTimestamp() as any,
        postId,
        tokenId,
        tokenType: 'mutePost',
      }

      // PostMuteデータを作成
      const postMute: PostMute = {
        activeUid: currentUserId,
        createdAt: serverTimestamp() as any,
        postId,
      }

      // トークンを保存
      const tokenRef = doc(db, 'private', 'v1', 'privateUsers', currentUserId, 'tokens', tokenId)
      batch.set(tokenRef, mutePostToken)

      // PostMuteを保存
      const postMuteRef = doc(db, 'public', 'v1', 'users', postUid, 'posts', postId, 'postMutes', currentUserId)
      batch.set(postMuteRef, postMute)

      await batch.commit()

      return { success: true, tokenId }
    } catch (error) {
      console.error('Error muting post:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ミュートに失敗しました' 
      }
    }
  }

  // 投稿のミュートを解除する
  async unmutePost(
    currentUserId: string,
    postUid: string,
    postId: string,
    tokenId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const batch = writeBatch(db)

      // トークンを削除
      const tokenRef = doc(db, 'private', 'v1', 'privateUsers', currentUserId, 'tokens', tokenId)
      batch.delete(tokenRef)

      // PostMuteを削除
      const postMuteRef = doc(db, 'public', 'v1', 'users', postUid, 'posts', postId, 'postMutes', currentUserId)
      batch.delete(postMuteRef)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Error unmuting post:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ミュート解除に失敗しました' 
      }
    }
  }

  // ユーザーのミュート投稿トークンを取得（リトライなし）
  async getMutePostTokens(userId: string): Promise<MutePostTokenEntity[]> {
    try {
      const tokensRef = collection(db, 'private', 'v1', 'privateUsers', userId, 'tokens')
      const q = query(
        tokensRef,
        where('tokenType', '==', 'mutePost'),
        orderBy('createdAt', 'desc')
      )
      
      // 一度だけ実行、リトライしない
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as MutePostToken
        return {
          activeUid: data.activeUid,
          postId: data.postId,
          tokenId: data.tokenId,
        }
      })
    } catch (error) {
      console.error('Error getting mute post tokens (no retry):', error)
      // エラーの場合は空配列を返す（リトライしない）
      return []
    }
  }

  // ミュートされた投稿を取得（投稿IDのリストから）
  async getMutedPosts(postIds: string[]): Promise<PublicPost[]> {
    if (postIds.length === 0) return []

    try {
      // Firestore の whereIn は最大10個までなので、チャンクに分ける
      const chunks = []
      for (let i = 0; i < postIds.length; i += 10) {
        chunks.push(postIds.slice(i, i + 10))
      }

      const allPosts: PublicPost[] = []

      for (const chunk of chunks) {
        // 投稿をcollectionGroupで検索
        const postsRef = collection(db, 'public', 'v1', 'users')
        // Note: 実際の実装では、投稿IDから投稿を取得する適切なクエリが必要
        // ここでは簡略化していますが、実際にはより効率的な方法を検討してください
      }

      return allPosts
    } catch (error) {
      console.error('Error getting muted posts:', error)
      return []
    }
  }
}