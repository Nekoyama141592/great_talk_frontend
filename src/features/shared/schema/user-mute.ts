import { Timestamp } from 'firebase/firestore'

// ユーザーミュート関係のスキーマ定義
export interface UserMute {
  activeUid: string // ミュートを実行したユーザーID
  createdAt: Timestamp // 作成日時
  passiveUid: string // ミュートされたユーザーID
}

// ユーザーミュートトークン（プライベートコレクション用）
export interface MuteUserToken {
  activeUid: string // ミュートを実行したユーザーID
  createdAt: Timestamp // 作成日時
  passiveUid: string // ミュートされたユーザーID
  tokenId: string // 一意のトークンID
  tokenType: 'muteUser' // トークンタイプ
}

// クライアント側で使用するエンティティ（軽量版）
export interface MuteUserTokenEntity {
  activeUid: string // ミュートを実行したユーザーID
  passiveUid: string // ミュートされたユーザーID
  tokenId: string // 一意のトークンID
}

// ユーザーミュート操作の結果
export interface UserMuteResult {
  success: boolean
  error?: string
  tokenId?: string
}

// ユーザーミュート状態
export interface UserMuteState {
  muteUserTokens: MuteUserTokenEntity[]
  loadingUserIds: string[] // ミュート処理中のユーザーID
}
