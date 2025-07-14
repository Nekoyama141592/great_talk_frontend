import { Timestamp } from 'firebase/firestore'

export interface PostMute {
  activeUid: string    // ミュートを行ったユーザーのUID
  createdAt: Timestamp // ミュート作成時刻
  postId: string       // ミュートされた投稿のID
}

export interface MutePostToken {
  activeUid: string    // ミュートを行ったユーザーのUID
  createdAt: Timestamp // 作成時刻
  postId: string       // ミュートされた投稿のID
  tokenId: string      // トークンの一意ID
  tokenType: 'mutePost' // トークンタイプ
}

export interface MutePostTokenEntity {
  activeUid: string
  postId: string
  tokenId: string
}