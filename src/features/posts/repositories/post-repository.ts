import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '@shared/infrastructures/firebase'
import { db } from '@shared/infrastructures/firebase'
import { CreatePostRequest } from '@shared/schema/create-post'

export class PostRepository {
  async createPost(userId: string, postData: CreatePostRequest): Promise<string> {
    const postId = doc(collection(db, 'posts')).id
    
    // Upload image if it's a File
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
    const fileName = `${userId}/${postId}/image.jpg`
    const imageRef = ref(storage, fileName)
    
    await uploadBytes(imageRef, image)
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