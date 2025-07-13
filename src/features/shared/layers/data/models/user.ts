/**
 * DATA LAYER - User Models
 * Raw user data as it comes from Firebase/API
 */

import {
  BaseFirestoreEntity,
  RawDataEnvelope,
} from '@shared/layers/data/models/base'

// Raw user data exactly as stored in Firestore
export interface RawUserData {
  uid: string
  username: string
  bio: string
  photoURL: string
  createdAt: Date
  updatedAt: Date
  followerCount: number
  followingCount: number
  postCount: number
  isOfficial: boolean
  isSuspended: boolean
  suspendedUntil?: Date
  verifiedAt?: Date
  lastLoginAt?: Date
  metadata: Record<string, unknown>
}

// Firebase document structure
export interface FirestoreUserDocument extends BaseFirestoreEntity {
  data: RawUserData
}

// Authentication raw data
export interface RawAuthData {
  uid: string
  email?: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  creationTime: string
  lastSignInTime: string
  providerData: Array<{
    providerId: string
    uid: string
    displayName?: string
    email?: string
    photoURL?: string
  }>
}

// Raw user preferences (local storage)
export interface RawUserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private'
    showOnlineStatus: boolean
  }
}

// User data envelope types
export type UserDataEnvelope = RawDataEnvelope<RawUserData>
export type AuthDataEnvelope = RawDataEnvelope<RawAuthData>
export type UserPreferencesEnvelope = RawDataEnvelope<RawUserPreferences>
