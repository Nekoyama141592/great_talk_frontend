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
      const tokenRef = doc(collection(db, `private/v1/privateUsers/${currentUserId}/tokens`), `like_${postId}`)
      const tokenData: Omit<PostLikeToken, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
        createdAt: serverTimestamp(),
        tokenId: `like_${postId}`,
        tokenType: 'postLike',
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
      const batch = writeBatch(db)

      // Delete the like token
      const tokenRef = doc(db, `private/v1/privateUsers/${currentUserId}/tokens/like_${postId}`)
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
      const tokenRef = doc(db, `private/v1/privateUsers/${currentUserId}/tokens/like_${postId}`)
      const docSnapshot = await getDoc(tokenRef)
      return docSnapshot.exists()
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
        where('tokenType', '==', 'postLike')
      )
      const querySnapshot = await getDocs(tokensQuery)
      
      return querySnapshot.docs
        .map(doc => doc.data().tokenId)
        .filter((tokenId): tokenId is string => !!tokenId && tokenId.startsWith('like_'))
        .map(tokenId => tokenId.replace('like_', ''))
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