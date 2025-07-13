/**
 * DATA LAYER - Firebase User Repository
 * Concrete implementation for user data access
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore'

import { db } from '@shared/infrastructures/firebase'
import {
  BaseRepository,
  FilterOptions,
  PaginatedResult,
  NotFoundError,
  NetworkError,
  ValidationError,
} from '@shared/layers/data/repositories/base'
import { RawUserData } from '@shared/layers/data/models/user'
import {
  RawDataEnvelope,
  DataSource,
  RawPagination,
} from '@shared/layers/data/models/base'

export class FirebaseUserRepository
  implements BaseRepository<RawUserData, string>
{
  private readonly collectionPath = 'public/v1/users'

  async findById(uid: string): Promise<RawDataEnvelope<RawUserData> | null> {
    try {
      const docRef = doc(db, this.collectionPath, uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null
      }

      return this.wrapData(docSnap.data() as RawUserData)
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async findMany(
    filters?: FilterOptions<RawUserData>
  ): Promise<RawDataEnvelope<RawUserData[]>> {
    try {
      const collectionRef = collection(db, this.collectionPath)
      let q = query(collectionRef)

      if (filters) {
        q = this.applyFilters(q, filters)
      }

      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map(doc => doc.data() as RawUserData)

      return this.wrapData(users)
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async create(
    userData: Partial<RawUserData>
  ): Promise<RawDataEnvelope<RawUserData>> {
    try {
      const now = new Date()
      const fullUserData: RawUserData = {
        uid: userData.uid || '',
        username: userData.username || '',
        bio: userData.bio || '',
        photoURL: userData.photoURL || '',
        createdAt: now,
        updatedAt: now,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        isOfficial: false,
        isSuspended: false,
        metadata: {},
        ...userData,
      }

      const docRef = doc(db, this.collectionPath, fullUserData.uid)
      await updateDoc(docRef, { ...fullUserData })

      return this.wrapData(fullUserData)
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async update(
    uid: string,
    userData: Partial<RawUserData>
  ): Promise<RawDataEnvelope<RawUserData>> {
    try {
      const docRef = doc(db, this.collectionPath, uid)
      const updateData = {
        ...userData,
        updatedAt: new Date(),
      }

      await updateDoc(docRef, updateData)

      // Fetch updated document
      const updatedDoc = await this.findById(uid)
      if (!updatedDoc) {
        throw new NotFoundError('User', uid)
      }

      return updatedDoc
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async delete(uid: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.collectionPath, uid)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async findByFilter(
    filter: FilterOptions<RawUserData>
  ): Promise<RawDataEnvelope<RawUserData[]>> {
    return this.findMany(filter)
  }

  async findWithPagination(
    pagination: RawPagination,
    filters?: FilterOptions<RawUserData>
  ): Promise<PaginatedResult<RawUserData>> {
    try {
      const collectionRef = collection(db, this.collectionPath)
      let q = query(collectionRef)

      if (filters) {
        q = this.applyFilters(q, filters)
      }

      q = query(q, limit(pagination.limit))

      if (pagination.cursor) {
        // For cursor-based pagination, we'd need to store the last document
        // This is a simplified implementation
      }

      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map(doc => doc.data() as RawUserData)

      return {
        data: this.wrapData(users),
        pagination: {
          hasMore: users.length === pagination.limit,
          limit: pagination.limit,
          nextCursor:
            users.length > 0 ? users[users.length - 1].uid : undefined,
        },
      }
    } catch (error) {
      throw this.handleFirestoreError(error)
    }
  }

  async count(filters?: FilterOptions<RawUserData>): Promise<number> {
    const result = await this.findMany(filters)
    return result.data.length
  }

  subscribe(
    uid: string,
    callback: (data: RawDataEnvelope<RawUserData> | null) => void
  ): () => void {
    const docRef = doc(db, this.collectionPath, uid)

    return onSnapshot(
      docRef,
      doc => {
        if (doc.exists()) {
          callback(this.wrapData(doc.data() as RawUserData))
        } else {
          callback(null)
        }
      },
      error => {
        console.error('User subscription error:', error)
        callback(null)
      }
    )
  }

  subscribeToQuery(
    filter: FilterOptions<RawUserData>,
    callback: (data: RawDataEnvelope<RawUserData[]>) => void
  ): () => void {
    const collectionRef = collection(db, this.collectionPath)
    let q = query(collectionRef)

    if (filter) {
      q = this.applyFilters(q, filter)
    }

    return onSnapshot(
      q,
      querySnapshot => {
        const users = querySnapshot.docs.map(doc => doc.data() as RawUserData)
        callback(this.wrapData(users))
      },
      error => {
        console.error('User query subscription error:', error)
        callback(this.wrapData([]))
      }
    )
  }

  async invalidateCache(_uid?: string): Promise<void> {
    // Implementation depends on caching strategy
    // For now, this is a no-op
  }

  async preload(uids: string[]): Promise<void> {
    // Batch fetch users for performance
    const promises = uids.map(uid => this.findById(uid))
    await Promise.allSettled(promises)
  }

  // Helper methods
  private wrapData<T>(data: T): RawDataEnvelope<T> {
    return {
      data,
      source: DataSource.FIRESTORE,
      timestamp: new Date(),
      metadata: {},
    }
  }

  private applyFilters(q: any, filters: FilterOptions<RawUserData>): any {
    let query = q

    if (filters.where) {
      filters.where.forEach(condition => {
        query = where(
          condition.field as string,
          condition.operator,
          condition.value
        )(query)
      })
    }

    if (filters.orderBy) {
      filters.orderBy.forEach(order => {
        query = orderBy(order.field as string, order.direction)(query)
      })
    }

    if (filters.limit) {
      query = limit(filters.limit)(query)
    }

    return query
  }

  private handleFirestoreError(error: any): Error {
    if (error instanceof FirestoreError) {
      switch (error.code) {
        case 'not-found':
          return new NotFoundError('User', 'unknown')
        case 'permission-denied':
          return new ValidationError('Permission denied', { code: error.code })
        case 'unavailable':
          return new NetworkError('Firestore unavailable')
        default:
          return new NetworkError(`Firestore error: ${error.message}`)
      }
    }
    return error instanceof Error ? error : new Error(String(error))
  }
}
