export interface PutObjectRequest {
  base64Image: string
  object: string
}

export interface PutObjectResponse {
  base64Image: string
}

export interface ApiResult<T> {
  success: boolean
  data?: T
  error?: string
}
