import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { CreatePostRequest } from '@shared/schema/create-post'
import { ApiRepository } from '@shared/repositories/api-repository'
import { generateRandomId } from '@shared/utils/id-util'

export class PostRepository {
  private apiRepository = new ApiRepository()

  async createPost(userId: string, postData: CreatePostRequest): Promise<string> {
    const postId = generateRandomId()
    
    // Upload image using Cloud Functions
    let imageFileName = ''
    if (postData.image instanceof File) {
      imageFileName = await this.uploadImage(userId, postId, postData.image)
    } else {
      imageFileName = postData.image
    }

    const postDocData = {
      bookmarkCount: 0,
      createdAt: serverTimestamp(),
      customCompleteText: {
        systemPrompt: postData.systemPrompt.trim()
      },
      description: {
        value: postData.description.trim()
      },
      exampleTexts: [],
      genre: '',
      hashTags: [],
      image: {
        bucketName: '',
        value: imageFileName
      },
      impressionCount: 0,
      likeCount: 0,
      links: [],
      msgCount: 0,
      muteCount: 0,
      postId,
      reportCount: 0,
      score: 0.0,
      searchToken: this.createSearchToken(postData.title),
      title: {
        value: postData.title.trim()
      },
      uid: userId,
      updatedAt: serverTimestamp(),
      userCount: 0
    }

    const userPostRef = doc(db, 'public', 'v1', 'users', userId, 'posts', postId)
    await setDoc(userPostRef, postDocData)
    
    return postId
  }

  private async uploadImage(userId: string, postId: string, image: File): Promise<string> {
    const fileName = this.apiRepository.generatePostImagePath(userId, postId)
    const base64Image = await this.apiRepository.fileToBase64(image)
    
    const result = await this.apiRepository.putObject(base64Image, fileName)
    
    if (!result.success) {
      throw new Error(result.error || '画像のアップロードに失敗しました')
    }
    
    return fileName
  }

  private createSearchToken(title: string): Record<string, boolean> {
    const tokens: Record<string, boolean> = {}
    const words = title.toLowerCase().split(/\s+/)
    
    for (const word of words) {
      for (let i = 1; i <= word.length; i++) {
        tokens[word.substring(0, i)] = true
      }
    }
    
    return tokens
  }
}