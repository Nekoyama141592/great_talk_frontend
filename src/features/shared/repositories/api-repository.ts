import { httpsCallable } from 'firebase/functions'
import { functions } from '@shared/infrastructures/firebase'
import { PutObjectRequest, PutObjectResponse, ApiResult } from '@shared/schema/api-requests'

export class ApiRepository {
  /**
   * Upload image to Cloud Storage using Cloud Functions
   */
  async putObject(base64Image: string, object: string): Promise<ApiResult<PutObjectResponse>> {
    try {
      const putObjectV2 = httpsCallable(functions, 'putObjectV2')
      
      const request: PutObjectRequest = {
        base64Image,
        object
      }
      
      const result = await putObjectV2(request)
      const response = result.data as PutObjectResponse
      
      return {
        success: true,
        data: response
      }
    } catch {
      return {
        success: false,
        error: '画像のアップロードが失敗しました'
      }
    }
  }

  /**
   * Convert File to base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Generate file path for user post image
   */
  generatePostImagePath(userId: string, postId: string): string {
    return `${userId}/${postId}/image.jpg`
  }
}