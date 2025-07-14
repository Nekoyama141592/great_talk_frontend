import {
  doc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PostLike, PostLikeToken, ApiResult } from '@shared/schema/api-requests'
import { generateUUID } from '@shared/utils/id-util'

export class PostLikeRepository {
  /**
   * Like a post by creating both post like record and like token
   */
  async likePost(
    currentUserId: string, 
    targetUserId: string, 
    postId: string
  ): Promise<ApiResult<void>> {
    try {
      const batch = writeBatch(db)
      
      // Create post like record in the post's postLikes collection
      const postLikeRef = doc(collection(db, `public/v1/users/${targetUserId}/posts/${postId}/postLikes`), currentUserId)
      const postLikeData: Omit<PostLike, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
        activeUid: currentUserId,
        passiveUid: targetUserId,
        postId: postId,
        createdAt: serverTimestamp(),
      }
      batch.set(postLikeRef, postLikeData)

      // Create like token in current user's private tokens collection
      const tokenId = generateUUID()
      const tokenRef = doc(collection(db, `private/v1/privateUsers/${currentUserId}/tokens`), tokenId)
      const tokenData: Omit<PostLikeToken, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
        activeUid: currentUserId,
        createdAt: serverTimestamp(),
        passiveUid: targetUserId,
        postId: postId,
        tokenId: tokenId,
        tokenType: 'likePost',
      }
      batch.set(tokenRef, tokenData)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Like post error:', error)
      return {
        success: false,
        error: '投稿のいいねに失敗しました',
      }
    }
  }

  /**
   * Unlike a post by deleting both post like record and like token
   */
  async unlikePost(
    currentUserId: string, 
    targetUserId: string, 
    postId: string
  ): Promise<ApiResult<void>> {
    try {
      // First find the token ID by querying the tokens collection
      const tokensQuery = query(
        collection(db, `private/v1/privateUsers/${currentUserId}/tokens`),
        where('tokenType', '==', 'likePost'),
        where('postId', '==', postId)
      )
      const tokenSnapshot = await getDocs(tokensQuery)
      
      if (tokenSnapshot.empty) {
        throw new Error('Like token not found')
      }
      
      const batch = writeBatch(db)
      
      // Delete the like token
      const tokenDoc = tokenSnapshot.docs[0]
      const tokenRef = doc(db, `private/v1/privateUsers/${currentUserId}/tokens/${tokenDoc.id}`)
      batch.delete(tokenRef)

      // Delete corresponding post like record
      const postLikeRef = doc(db, `public/v1/users/${targetUserId}/posts/${postId}/postLikes/${currentUserId}`)
      batch.delete(postLikeRef)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Unlike post error:', error)
      return {
        success: false,
        error: '投稿のいいね取り消しに失敗しました',
      }
    }
  }

  /**
   * Check if current user has liked a specific post
   */
  async isPostLiked(currentUserId: string, postId: string): Promise<boolean> {
    try {
      const tokensQuery = query(
        collection(db, `private/v1/privateUsers/${currentUserId}/tokens`),
        where('tokenType', '==', 'likePost'),
        where('postId', '==', postId)
      )
      const querySnapshot = await getDocs(tokensQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Check post like status error:', error)
      return false
    }
  }

  /**
   * Get list of post IDs that current user has liked
   */
  async getLikedPosts(userId: string): Promise<string[]> {
    try {
      const tokensQuery = query(
        collection(db, `private/v1/privateUsers/${userId}/tokens`),
        where('tokenType', '==', 'likePost')
      )
      const querySnapshot = await getDocs(tokensQuery)
      
      return querySnapshot.docs
        .map(doc => doc.data().postId)
        .filter((postId): postId is string => !!postId)
    } catch (error) {
      console.error('Get liked posts error:', error)
      return []
    }
  }

  /**
   * Get list of users who liked a specific post
   */
  async getPostLikers(targetUserId: string, postId: string): Promise<string[]> {
    try {
      const postLikesQuery = query(collection(db, `public/v1/users/${targetUserId}/posts/${postId}/postLikes`))
      const querySnapshot = await getDocs(postLikesQuery)
      
      return querySnapshot.docs.map(doc => doc.data().activeUid)
    } catch (error) {
      console.error('Get post likers error:', error)
      return []
    }
  }
}