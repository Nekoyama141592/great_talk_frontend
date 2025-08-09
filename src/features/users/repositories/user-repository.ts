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
import {
  Follower,
  FollowingToken,
  ApiResult,
} from '@shared/schema/api-requests'

export class UserRepository {
  /**
   * Follow a user by creating both follower record and following token
   */
  async followUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<ApiResult<void>> {
    try {
      const batch = writeBatch(db)

      // Create follower record in target user's followers collection
      const followerRef = doc(
        collection(db, `public/v1/users/${targetUserId}/followers`),
        currentUserId
      )
      const followerData: Omit<Follower, 'createdAt'> & {
        createdAt: ReturnType<typeof serverTimestamp>
      } = {
        activeUid: currentUserId,
        passiveUid: targetUserId,
        createdAt: serverTimestamp(),
      }
      batch.set(followerRef, followerData)

      // Create following token in current user's private tokens collection
      const tokenRef = doc(
        collection(db, `private/v1/privateUsers/${currentUserId}/tokens`),
        targetUserId
      )
      const tokenData: Omit<FollowingToken, 'createdAt'> & {
        createdAt: ReturnType<typeof serverTimestamp>
      } = {
        createdAt: serverTimestamp(),
        tokenId: targetUserId,
        tokenType: 'following',
      }
      batch.set(tokenRef, tokenData)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Follow user error:', error)
      return {
        success: false,
        error: 'ユーザーのフォローに失敗しました',
      }
    }
  }

  /**
   * Unfollow a user by deleting both follower record and following token
   */
  async unfollowUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<ApiResult<void>> {
    try {
      const batch = writeBatch(db)

      // Delete the following token (using targetUserId as the document ID)
      const tokenRef = doc(
        db,
        `private/v1/privateUsers/${currentUserId}/tokens/${targetUserId}`
      )
      batch.delete(tokenRef)

      // Delete corresponding follower record
      const followerRef = doc(
        db,
        `public/v1/users/${targetUserId}/followers/${currentUserId}`
      )
      batch.delete(followerRef)

      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Unfollow user error:', error)
      return {
        success: false,
        error: 'ユーザーのアンフォローに失敗しました',
      }
    }
  }

  /**
   * Check if current user is following target user
   */
  async isFollowing(
    currentUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    try {
      const tokenRef = doc(
        db,
        `private/v1/privateUsers/${currentUserId}/tokens/${targetUserId}`
      )
      const docSnapshot = await getDoc(tokenRef)
      return docSnapshot.exists()
    } catch (error) {
      console.error('Check following status error:', error)
      return false
    }
  }

  /**
   * Get list of users that current user is following
   */
  async getFollowing(userId: string): Promise<string[]> {
    try {
      const tokensQuery = query(
        collection(db, `private/v1/privateUsers/${userId}/tokens`),
        where('tokenType', '==', 'following')
      )
      const querySnapshot = await getDocs(tokensQuery)

      return querySnapshot.docs.map(doc => doc.data().tokenId)
    } catch (error) {
      console.error('Get following list error:', error)
      return []
    }
  }

  /**
   * Get list of users following the target user
   */
  async getFollowers(userId: string): Promise<string[]> {
    try {
      const followersQuery = query(
        collection(db, `public/v1/users/${userId}/followers`)
      )
      const querySnapshot = await getDocs(followersQuery)

      return querySnapshot.docs.map(doc => doc.data().activeUid)
    } catch (error) {
      console.error('Get followers list error:', error)
      return []
    }
  }
}
