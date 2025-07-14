import {
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  where,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { UserMute, MuteUserToken, MuteUserTokenEntity, UserMuteResult } from '@shared/schema/user-mute'

// ユニークなトークンIDを生成
const generateTokenId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export class UserMuteRepository {
  // ユーザーをミュートする
  async muteUser(
    currentUserId: string,
    passiveUserId: string
  ): Promise<UserMuteResult> {
    try {
      const batch = writeBatch(db)
      const tokenId = generateTokenId()

      // トークンデータを作成
      const muteUserToken: MuteUserToken = {
        activeUid: currentUserId,
        createdAt: serverTimestamp() as any,
        passiveUid: passiveUserId,
        tokenId,
        tokenType: 'muteUser',
      }

      // UserMuteデータを作成
      const userMute: UserMute = {
        activeUid: currentUserId,
        createdAt: serverTimestamp() as any,
        passiveUid: passiveUserId,
      }

      // トークンを保存（プライベートコレクション）
      const tokenRef = doc(db, 'private', 'v1', 'privateUsers', currentUserId, 'tokens', tokenId)
      batch.set(tokenRef, muteUserToken)

      // UserMuteを保存（パブリックコレクション）
      const userMuteRef = doc(db, 'public', 'v1', 'users', passiveUserId, 'userMutes', currentUserId)
      batch.set(userMuteRef, userMute)

      await batch.commit()

      return { success: true, tokenId }
    } catch (error) {
      console.error('Error muting user:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ユーザーのミュートに失敗しました' 
      }
    }
  }

  // ユーザーのミュートを解除する
  async unmuteUser(
    currentUserId: string,
    passiveUserId: string,
    tokenId: string
  ): Promise<UserMuteResult> {
    try {
      const batch = writeBatch(db)

      // トークンを削除
      const tokenRef = doc(db, 'private', 'v1', 'privateUsers', currentUserId, 'tokens', tokenId)
      batch.delete(tokenRef)

      // UserMuteを削除
      const userMuteRef = doc(db, 'public', 'v1', 'users', passiveUserId, 'userMutes', currentUserId)
      batch.delete(userMuteRef)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Error unmuting user:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ユーザーのミュート解除に失敗しました' 
      }
    }
  }

  // ユーザーのミュートユーザートークンを取得（リトライなし）
  async getMuteUserTokens(userId: string): Promise<MuteUserTokenEntity[]> {
    try {
      const tokensRef = collection(db, 'private', 'v1', 'privateUsers', userId, 'tokens')
      const q = query(
        tokensRef,
        where('tokenType', '==', 'muteUser'),
        orderBy('createdAt', 'desc')
      )
      
      // 一度だけ実行、リトライしない
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as MuteUserToken
        return {
          activeUid: data.activeUid,
          passiveUid: data.passiveUid,
          tokenId: data.tokenId,
        }
      })
    } catch (error) {
      console.error('Error getting mute user tokens (no retry):', error)
      // エラーの場合は空配列を返す（リトライしない）
      return []
    }
  }

  // ミュートされたユーザーを取得（ユーザーIDのリストから）
  async getMutedUsers(userIds: string[]): Promise<any[]> {
    if (userIds.length === 0) return []

    try {
      // Firestore の whereIn は最大10個までなので、チャンクに分ける
      const chunks = []
      for (let i = 0; i < userIds.length; i += 10) {
        chunks.push(userIds.slice(i, i + 10))
      }

      const allUsers: any[] = []

      // for (const chunk of chunks) {
        // ユーザーをcollectionGroupで検索
        // const usersRef = collection(db, 'public', 'v1', 'users')
        // Note: 実際の実装では、ユーザーIDからユーザーを取得する適切なクエリが必要
        // ここでは簡略化していますが、実際にはより効率的な方法を検討してください
      // }

      return allUsers
    } catch (error) {
      console.error('Error getting muted users:', error)
      return []
    }
  }
}