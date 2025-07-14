export interface PutObjectRequest {
  base64Image: string
  object: string
}

export interface PutObjectResponse {
  base64Image: string
}

export interface GenerateImageRequest {
  prompt: string
  size: '1024x1024' | '1536x1024' | '1024x1536'
}

export interface GenerateImageResponse {
  base64: string
}

export interface Follower {
  activeUid: string
  passiveUid: string
  createdAt: Date
}

export interface FollowingToken {
  createdAt: Date
  tokenId: string
  tokenType: string
}

export interface PostLike {
  activeUid: string
  passiveUid: string
  postId: string
  createdAt: Date
}

export interface PostLikeToken {
  createdAt: Date
  tokenId: string
  tokenType: string
}

export interface ApiResult<T> {
  success: boolean
  data?: T
  error?: string
}
