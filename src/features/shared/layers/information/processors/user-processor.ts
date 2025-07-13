/**
 * INFORMATION LAYER - User Data Processor
 * Transforms raw user data into processed information
 */

import {
  RawUserData,
  RawAuthData,
  RawUserPreferences,
} from '../../data/models/user'
import {
  ProcessedUser,
  UserNotificationSettings,
} from '../models/processed-data'

export class UserDataProcessor {
  /**
   * Transform raw user data into processed user information
   */
  static processUserData(
    rawUser: RawUserData,
    authData?: RawAuthData,
    preferences?: RawUserPreferences
  ): ProcessedUser {
    const now = new Date()

    return {
      id: rawUser.uid,
      processedAt: now,
      dataVersion: '1.0',
      enrichments: {
        source: 'user-processor',
        authDataIncluded: !!authData,
        preferencesIncluded: !!preferences,
      },

      uid: rawUser.uid,
      username: rawUser.username,
      displayName: this.generateDisplayName(rawUser),
      bio: this.processUserBio(rawUser.bio),

      avatar: this.processAvatar(rawUser.photoURL),

      stats: {
        followers: rawUser.followerCount,
        following: rawUser.followingCount,
        posts: rawUser.postCount,
        engagementRate: this.calculateEngagementRate(rawUser),
        lastActivity: rawUser.lastLoginAt || rawUser.updatedAt,
      },

      status: {
        isOnline: this.determineOnlineStatus(rawUser.lastLoginAt),
        isOfficial: rawUser.isOfficial,
        isSuspended: rawUser.isSuspended,
        suspensionInfo: rawUser.isSuspended
          ? this.processSuspensionInfo(rawUser)
          : undefined,
        verification: {
          isVerified: rawUser.isOfficial,
          verifiedAt: rawUser.verifiedAt,
          verificationBadge: rawUser.isOfficial ? '✓' : '',
        },
      },

      social: {
        joinedAt: rawUser.createdAt,
        lastSeen: rawUser.lastLoginAt || rawUser.updatedAt,
        activityScore: this.calculateActivityScore(rawUser),
        influenceLevel: this.determineInfluenceLevel(rawUser),
      },

      preferences: this.processPreferences(preferences),
      privacy: this.processPrivacySettings(preferences),
    }
  }

  /**
   * Process multiple users efficiently
   */
  static processBatchUserData(
    rawUsers: RawUserData[],
    authDataMap?: Map<string, RawAuthData>,
    preferencesMap?: Map<string, RawUserPreferences>
  ): ProcessedUser[] {
    return rawUsers.map(user =>
      this.processUserData(
        user,
        authDataMap?.get(user.uid),
        preferencesMap?.get(user.uid)
      )
    )
  }

  /**
   * Generate a user-friendly display name
   */
  private static generateDisplayName(user: RawUserData): string {
    if (user.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1)
    }
    return `User${user.uid.slice(-6)}`
  }

  /**
   * Process and format user bio
   */
  private static processUserBio(bio: string): string {
    if (!bio?.trim()) {
      return 'No bio available'
    }

    return bio
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .slice(0, 500) // Ensure max length
  }

  /**
   * Process avatar URLs with fallbacks
   */
  private static processAvatar(photoURL: string) {
    const defaultAvatar = '/assets/default-avatar.png'
    const avatarUrl = photoURL || defaultAvatar

    return {
      url: avatarUrl,
      thumbnail: this.generateThumbnailUrl(avatarUrl),
      placeholder: this.generatePlaceholderUrl(avatarUrl),
    }
  }

  /**
   * Calculate user engagement rate
   */
  private static calculateEngagementRate(user: RawUserData): number {
    if (user.followerCount === 0) return 0

    // Simple engagement calculation - can be enhanced with more metrics
    const totalEngagement = user.postCount * 10 // Assume average interactions per post
    return Math.min((totalEngagement / user.followerCount) * 100, 100)
  }

  /**
   * Determine if user is currently online
   */
  private static determineOnlineStatus(lastLoginAt?: Date): boolean {
    if (!lastLoginAt) return false

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return lastLoginAt > fiveMinutesAgo
  }

  /**
   * Process suspension information
   */
  private static processSuspensionInfo(user: RawUserData) {
    if (!user.isSuspended) return undefined

    return {
      reason: 'Terms of service violation', // This would come from actual suspension data
      until:
        user.suspendedUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      appealable: true,
    }
  }

  /**
   * Calculate user activity score (0-100)
   */
  private static calculateActivityScore(user: RawUserData): number {
    const factors = {
      posts: Math.min(user.postCount / 100, 1) * 30, // Max 30 points
      followers: Math.min(user.followerCount / 1000, 1) * 25, // Max 25 points
      following: Math.min(user.followingCount / 500, 1) * 15, // Max 15 points
      recency: this.getRecencyScore(user.lastLoginAt || user.updatedAt) * 30, // Max 30 points
    }

    return Math.round(
      factors.posts + factors.followers + factors.following + factors.recency
    )
  }

  /**
   * Determine user influence level
   */
  private static determineInfluenceLevel(
    user: RawUserData
  ): 'newcomer' | 'regular' | 'popular' | 'influencer' | 'celebrity' {
    if (user.followerCount >= 100000) return 'celebrity'
    if (user.followerCount >= 10000) return 'influencer'
    if (user.followerCount >= 1000) return 'popular'
    if (user.followerCount >= 100 || user.postCount >= 10) return 'regular'
    return 'newcomer'
  }

  /**
   * Process user preferences with defaults
   */
  private static processPreferences(preferences?: RawUserPreferences) {
    const defaults = {
      theme: 'system' as const,
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        push: true,
        inApp: true,
        frequency: 'immediate' as const,
        types: {
          likes: true,
          comments: true,
          follows: true,
          mentions: true,
          aiResponses: true,
        },
      } as UserNotificationSettings,
    }

    if (!preferences) return defaults

    return {
      theme: preferences.theme || defaults.theme,
      language: preferences.language || defaults.language,
      timezone: defaults.timezone, // Would be determined from user data
      notifications: {
        ...defaults.notifications,
        email: preferences.notifications?.email ?? defaults.notifications.email,
        push: preferences.notifications?.push ?? defaults.notifications.push,
        inApp: preferences.notifications?.inApp ?? defaults.notifications.inApp,
      },
    }
  }

  /**
   * Process privacy settings with defaults
   */
  private static processPrivacySettings(preferences?: RawUserPreferences) {
    const defaults = {
      profileVisibility: 'public' as const,
      showOnlineStatus: true,
      allowDirectMessages: true,
    }

    if (!preferences?.privacy) return defaults

    return {
      profileVisibility:
        preferences.privacy.profileVisibility || defaults.profileVisibility,
      showOnlineStatus:
        preferences.privacy.showOnlineStatus ?? defaults.showOnlineStatus,
      allowDirectMessages: defaults.allowDirectMessages, // Would come from actual privacy settings
    }
  }

  /**
   * Helper: Generate thumbnail URL
   */
  private static generateThumbnailUrl(originalUrl: string): string {
    if (originalUrl.includes('default-avatar')) {
      return originalUrl
    }
    // This would integrate with your image processing service
    return `${originalUrl}?size=150`
  }

  /**
   * Helper: Generate placeholder URL
   */
  private static generatePlaceholderUrl(originalUrl: string): string {
    // Generate a low-quality placeholder for progressive loading
    return `${originalUrl}?size=50&quality=10`
  }

  /**
   * Helper: Calculate recency score (0-1)
   */
  private static getRecencyScore(date: Date): number {
    const now = Date.now()
    const timestamp = date.getTime()
    const daysSince = (now - timestamp) / (1000 * 60 * 60 * 24)

    if (daysSince <= 1) return 1
    if (daysSince <= 7) return 0.8
    if (daysSince <= 30) return 0.5
    if (daysSince <= 90) return 0.2
    return 0
  }
}
