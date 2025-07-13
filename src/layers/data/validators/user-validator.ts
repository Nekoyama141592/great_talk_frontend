/**
 * DATA LAYER - User Data Validator
 * Input validation and sanitization for user data
 */

import { ValidationResult } from '../models/base'
import { RawUserData } from '../models/user'

export class UserDataValidator {
  static validateUserData(data: Partial<RawUserData>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields validation
    if (!data.uid?.trim()) {
      errors.push('User ID is required')
    }

    if (!data.username?.trim()) {
      errors.push('Username is required')
    }

    // Format validation
    if (data.uid && !this.isValidUid(data.uid)) {
      errors.push('Invalid user ID format')
    }

    if (data.username && !this.isValidUsername(data.username)) {
      errors.push('Username must be 3-30 characters, alphanumeric and underscores only')
    }

    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters')
    }

    if (data.photoURL && !this.isValidUrl(data.photoURL)) {
      errors.push('Invalid photo URL format')
    }

    // Email validation (if provided)
    if (data.metadata?.email && !this.isValidEmail(data.metadata.email as string)) {
      errors.push('Invalid email format')
    }

    // Numeric validation
    if (data.followerCount !== undefined && data.followerCount < 0) {
      errors.push('Follower count cannot be negative')
    }

    if (data.followingCount !== undefined && data.followingCount < 0) {
      errors.push('Following count cannot be negative')
    }

    if (data.postCount !== undefined && data.postCount < 0) {
      errors.push('Post count cannot be negative')
    }

    // Date validation
    if (data.createdAt && this.isInvalidDate(data.createdAt)) {
      errors.push('Invalid creation date')
    }

    if (data.updatedAt && this.isInvalidDate(data.updatedAt)) {
      errors.push('Invalid update date')
    }

    if (data.suspendedUntil && this.isInvalidDate(data.suspendedUntil)) {
      errors.push('Invalid suspension date')
    }

    // Business logic warnings
    if (data.followerCount && data.followerCount > 1000000) {
      warnings.push('Unusually high follower count')
    }

    if (data.isSuspended && !data.suspendedUntil) {
      warnings.push('Suspended user should have suspension end date')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  static sanitizeUserData(data: Partial<RawUserData>): Partial<RawUserData> {
    const sanitized: Partial<RawUserData> = {}

    // Sanitize strings
    if (data.uid) sanitized.uid = this.sanitizeString(data.uid)
    if (data.username) sanitized.username = this.sanitizeUsername(data.username)
    if (data.bio) sanitized.bio = this.sanitizeText(data.bio)
    if (data.photoURL) sanitized.photoURL = this.sanitizeUrl(data.photoURL)

    // Copy safe values
    if (data.createdAt) sanitized.createdAt = data.createdAt
    if (data.updatedAt) sanitized.updatedAt = data.updatedAt
    if (data.followerCount !== undefined) sanitized.followerCount = Math.max(0, data.followerCount)
    if (data.followingCount !== undefined) sanitized.followingCount = Math.max(0, data.followingCount)
    if (data.postCount !== undefined) sanitized.postCount = Math.max(0, data.postCount)
    if (data.isOfficial !== undefined) sanitized.isOfficial = Boolean(data.isOfficial)
    if (data.isSuspended !== undefined) sanitized.isSuspended = Boolean(data.isSuspended)
    if (data.suspendedUntil) sanitized.suspendedUntil = data.suspendedUntil
    if (data.verifiedAt) sanitized.verifiedAt = data.verifiedAt
    if (data.lastLoginAt) sanitized.lastLoginAt = data.lastLoginAt

    // Sanitize metadata
    if (data.metadata) {
      sanitized.metadata = this.sanitizeMetadata(data.metadata)
    }

    return sanitized
  }

  // Private validation helpers
  private static isValidUid(uid: string): boolean {
    return /^[a-zA-Z0-9_-]{1,128}$/.test(uid)
  }

  private static isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]{3,30}$/.test(username)
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private static isInvalidDate(date: Date): boolean {
    return !(date instanceof Date) || isNaN(date.getTime())
  }

  // Private sanitization helpers
  private static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ')
  }

  private static sanitizeUsername(username: string): string {
    return username.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '')
  }

  private static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
  }

  private static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.href
    } catch {
      return ''
    }
  }

  private static sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value)
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value
      } else if (value instanceof Date) {
        sanitized[key] = value
      } else if (Array.isArray(value)) {
        sanitized[key] = value.filter(item => 
          typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
        )
      }
      // Skip other types for security
    }

    return sanitized
  }
}