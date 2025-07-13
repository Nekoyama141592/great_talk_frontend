/**
 * INFORMATION LAYER - Processed Data Models
 * Transformed and enriched data ready for application use
 */

// Base processed entity
export interface ProcessedEntity {
  id: string
  processedAt: Date
  dataVersion: string
  enrichments: Record<string, unknown>
}

// Processed user information
export interface ProcessedUser extends ProcessedEntity {
  uid: string
  username: string
  displayName: string
  bio: string
  avatar: {
    url: string
    thumbnail: string
    placeholder: string
  }
  stats: {
    followers: number
    following: number
    posts: number
    engagementRate: number
    lastActivity: Date
  }
  status: {
    isOnline: boolean
    isOfficial: boolean
    isSuspended: boolean
    suspensionInfo?: {
      reason: string
      until: Date
      appealable: boolean
    }
    verification: {
      isVerified: boolean
      verifiedAt?: Date
      verificationBadge: string
    }
  }
  social: {
    joinedAt: Date
    lastSeen: Date
    activityScore: number
    influenceLevel: 'newcomer' | 'regular' | 'popular' | 'influencer' | 'celebrity'
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: UserNotificationSettings
  }
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private'
    showOnlineStatus: boolean
    allowDirectMessages: boolean
  }
}

export interface UserNotificationSettings {
  email: boolean
  push: boolean
  inApp: boolean
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  types: {
    likes: boolean
    comments: boolean
    follows: boolean
    mentions: boolean
    aiResponses: boolean
  }
}

// Processed post information
export interface ProcessedPost extends ProcessedEntity {
  postId: string
  author: {
    uid: string
    username: string
    displayName: string
    avatar: string
    isOfficial: boolean
  }
  content: {
    title: string
    description: string
    formattedDescription: string // Markdown rendered
    wordCount: number
    readingTime: number // in minutes
    language: string
    sentiment: 'positive' | 'neutral' | 'negative'
  }
  media: {
    images: ProcessedImage[]
    hasImages: boolean
    imageCount: number
  }
  ai: {
    systemPrompt: string
    model: string
    settings: {
      temperature: number
      maxTokens: number
    }
    responseCount: number
    averageResponseTime: number
    popularTopics: string[]
  }
  engagement: {
    views: number
    interactions: number
    likes: number
    bookmarks: number
    shares: number
    comments: number
    engagementRate: number
    trendingScore: number
  }
  metadata: {
    createdAt: Date
    updatedAt: Date
    publishedAt: Date
    isPublic: boolean
    isPinned: boolean
    isTrending: boolean
    tags: ProcessedTag[]
    categories: string[]
  }
  quality: {
    contentScore: number
    moderationFlags: string[]
    aiSafetyScore: number
    userReportCount: number
  }
}

export interface ProcessedImage {
  id: string
  url: string
  thumbnail: string
  placeholder: string
  alt: string
  caption?: string
  dimensions: {
    width: number
    height: number
    aspectRatio: number
  }
  fileInfo: {
    size: number
    format: string
    quality: number
  }
  moderation: {
    isApproved: boolean
    flags: string[]
    confidence: number
  }
}

export interface ProcessedTag {
  name: string
  displayName: string
  count: number
  category: string
  trending: boolean
  description?: string
}

// Processed AI interaction
export interface ProcessedAIInteraction extends ProcessedEntity {
  interactionId: string
  postId: string
  user: {
    uid: string
    username: string
    displayName: string
  }
  conversation: {
    userPrompt: string
    formattedPrompt: string
    aiResponse: string
    formattedResponse: string
    systemContext: string
  }
  technical: {
    model: string
    temperature: number
    tokenUsage: {
      prompt: number
      completion: number
      total: number
      cost: number
    }
    responseTime: number
    quality: {
      relevance: number
      helpfulness: number
      accuracy: number
    }
  }
  metadata: {
    timestamp: Date
    sessionId: string
    deviceInfo: string
    location?: string
  }
}

// Aggregated information
export interface UserAnalytics {
  userId: string
  timeframe: 'day' | 'week' | 'month' | 'year'
  metrics: {
    postsCreated: number
    aiInteractions: number
    engagementReceived: number
    engagementGiven: number
    newFollowers: number
    profileViews: number
  }
  trends: {
    growthRate: number
    engagementTrend: 'up' | 'down' | 'stable'
    topPerformingPosts: string[]
    popularTopics: string[]
  }
  insights: {
    bestPostingTimes: Date[]
    audienceInsights: {
      demographics: Record<string, number>
      interests: string[]
      engagement_patterns: Record<string, number>
    }
  }
}

export interface TrendingContent {
  timeframe: 'hour' | 'day' | 'week'
  posts: Array<{
    postId: string
    title: string
    author: string
    score: number
    growth: number
  }>
  topics: Array<{
    name: string
    mentions: number
    growth: number
  }>
  users: Array<{
    uid: string
    username: string
    followerGrowth: number
    engagementScore: number
  }>
}