/**
 * INFORMATION LAYER - Content Aggregator
 * Combines and aggregates data from multiple sources
 */

import { ProcessedUser, ProcessedPost, TrendingContent, UserAnalytics } from '../models/processed-data'

export class ContentAggregator {
  /**
   * Aggregate user feed content with personalization
   */
  static aggregateUserFeed(
    user: ProcessedUser,
    allPosts: ProcessedPost[],
    followingUsers: ProcessedUser[]
  ): ProcessedPost[] {
    const followingUids = new Set(followingUsers.map(u => u.uid))
    
    // Filter posts from followed users and public posts
    const relevantPosts = allPosts.filter(post => 
      followingUids.has(post.author.uid) || 
      (post.metadata.isPublic && !this.isContentFiltered(post, user))
    )

    // Sort by relevance score
    return relevantPosts
      .map(post => ({
        ...post,
        relevanceScore: this.calculateRelevanceScore(post, user, followingUids.has(post.author.uid))
      }))
      .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
      .slice(0, 30) // Limit feed size
  }

  /**
   * Aggregate trending content across timeframes
   */
  static aggregateTrendingContent(
    posts: ProcessedPost[],
    users: ProcessedUser[],
    timeframe: 'hour' | 'day' | 'week'
  ): TrendingContent {
    const cutoffDate = this.getTimeframeCutoff(timeframe)
    
    // Filter recent content
    const recentPosts = posts.filter(post => 
      post.metadata.publishedAt >= cutoffDate
    )

    // Calculate trending posts
    const trendingPosts = recentPosts
      .map(post => ({
        postId: post.postId,
        title: post.content.title,
        author: post.author.username,
        score: post.engagement.trendingScore,
        growth: this.calculateGrowthRate(post, timeframe)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    // Extract trending topics
    const topicCounts = new Map<string, number>()
    recentPosts.forEach(post => {
      post.metadata.tags.forEach(tag => {
        topicCounts.set(tag.name, (topicCounts.get(tag.name) || 0) + 1)
      })
    })

    const trendingTopics = Array.from(topicCounts.entries())
      .map(([name, mentions]) => ({
        name,
        mentions,
        growth: this.calculateTopicGrowth(name, timeframe)
      }))
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 10)

    // Calculate trending users
    const trendingUsers = users
      .filter(user => user.social.lastSeen >= cutoffDate)
      .map(user => ({
        uid: user.uid,
        username: user.username,
        followerGrowth: this.calculateFollowerGrowth(user, timeframe),
        engagementScore: user.stats.engagementRate
      }))
      .sort((a, b) => b.followerGrowth - a.followerGrowth)
      .slice(0, 10)

    return {
      timeframe,
      posts: trendingPosts,
      topics: trendingTopics,
      users: trendingUsers
    }
  }

  /**
   * Aggregate user analytics and insights
   */
  static aggregateUserAnalytics(
    user: ProcessedUser,
    userPosts: ProcessedPost[],
    timeframe: 'day' | 'week' | 'month' | 'year'
  ): UserAnalytics {
    const cutoffDate = this.getTimeframeCutoff(timeframe)
    const recentPosts = userPosts.filter(post => 
      post.metadata.publishedAt >= cutoffDate
    )

    // Calculate metrics
    const metrics = {
      postsCreated: recentPosts.length,
      aiInteractions: recentPosts.reduce((sum, post) => sum + post.ai.responseCount, 0),
      engagementReceived: recentPosts.reduce((sum, post) => sum + post.engagement.interactions, 0),
      engagementGiven: 0, // Would need interaction data
      newFollowers: this.calculateNewFollowers(user, timeframe),
      profileViews: 0 // Would need view tracking data
    }

    // Calculate trends
    const trends = {
      growthRate: this.calculateUserGrowthRate(user, timeframe),
      engagementTrend: this.determineEngagementTrend(recentPosts),
      topPerformingPosts: recentPosts
        .sort((a, b) => b.engagement.engagementRate - a.engagement.engagementRate)
        .slice(0, 5)
        .map(post => post.postId),
      popularTopics: this.extractPopularTopics(recentPosts)
    }

    // Generate insights
    const insights = {
      bestPostingTimes: this.calculateBestPostingTimes(recentPosts),
      audienceInsights: {
        demographics: {}, // Would need follower demographic data
        interests: this.extractAudienceInterests(recentPosts),
        engagement_patterns: this.analyzeEngagementPatterns(recentPosts)
      }
    }

    return {
      userId: user.uid,
      timeframe,
      metrics,
      trends,
      insights
    }
  }

  /**
   * Aggregate search results with ranking
   */
  static aggregateSearchResults(
    query: string,
    posts: ProcessedPost[],
    users: ProcessedUser[]
  ): { posts: ProcessedPost[], users: ProcessedUser[] } {
    const normalizedQuery = query.toLowerCase().trim()

    // Search and rank posts
    const matchingPosts = posts
      .filter(post => this.matchesQuery(post, normalizedQuery))
      .map(post => ({
        ...post,
        searchScore: this.calculateSearchScore(post, normalizedQuery)
      }))
      .sort((a, b) => (b as any).searchScore - (a as any).searchScore)

    // Search and rank users
    const matchingUsers = users
      .filter(user => this.userMatchesQuery(user, normalizedQuery))
      .map(user => ({
        ...user,
        searchScore: this.calculateUserSearchScore(user, normalizedQuery)
      }))
      .sort((a, b) => (b as any).searchScore - (a as any).searchScore)

    return {
      posts: matchingPosts.slice(0, 20),
      users: matchingUsers.slice(0, 10)
    }
  }

  // Private helper methods

  private static calculateRelevanceScore(
    post: ProcessedPost,
    user: ProcessedUser,
    isFromFollowedUser: boolean
  ): number {
    let score = 0

    // Base engagement score
    score += post.engagement.engagementRate * 30

    // Recency bonus
    const hoursOld = (Date.now() - post.metadata.publishedAt.getTime()) / (1000 * 60 * 60)
    score += Math.max(0, 24 - hoursOld) * 2

    // Following bonus
    if (isFromFollowedUser) score += 20

    // Quality bonus
    score += post.quality.contentScore * 10

    // Official user bonus
    if (post.author.isOfficial) score += 10

    // Trending bonus
    if (post.metadata.isTrending) score += 15

    return Math.round(score)
  }

  private static isContentFiltered(post: ProcessedPost, user: ProcessedUser): boolean {
    // Check if content should be filtered for this user
    if (post.quality.moderationFlags.length > 0) return true
    if (post.quality.aiSafetyScore < 0.7) return true
    if (post.quality.userReportCount > 5) return true
    return false
  }

  private static getTimeframeCutoff(timeframe: string): Date {
    const now = new Date()
    switch (timeframe) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000)
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }
  }

  private static calculateGrowthRate(post: ProcessedPost, timeframe: string): number {
    // Simplified growth calculation - would need historical data
    return post.engagement.trendingScore * Math.random() * 100
  }

  private static calculateTopicGrowth(topic: string, timeframe: string): number {
    // Simplified topic growth - would need historical topic data
    return Math.random() * 100
  }

  private static calculateFollowerGrowth(user: ProcessedUser, timeframe: string): number {
    // Simplified follower growth - would need historical follower data
    return Math.floor(user.stats.followers * 0.1 * Math.random())
  }

  private static calculateNewFollowers(user: ProcessedUser, timeframe: string): number {
    // Simplified calculation - would need actual follower history
    return Math.floor(user.stats.followers * 0.05)
  }

  private static calculateUserGrowthRate(user: ProcessedUser, timeframe: string): number {
    // Simplified user growth - would need historical data
    return user.social.activityScore / 10
  }

  private static determineEngagementTrend(posts: ProcessedPost[]): 'up' | 'down' | 'stable' {
    if (posts.length < 2) return 'stable'
    
    const recent = posts.slice(0, Math.ceil(posts.length / 2))
    const older = posts.slice(Math.ceil(posts.length / 2))
    
    const recentAvg = recent.reduce((sum, p) => sum + p.engagement.engagementRate, 0) / recent.length
    const olderAvg = older.reduce((sum, p) => sum + p.engagement.engagementRate, 0) / older.length
    
    const difference = recentAvg - olderAvg
    if (difference > 5) return 'up'
    if (difference < -5) return 'down'
    return 'stable'
  }

  private static extractPopularTopics(posts: ProcessedPost[]): string[] {
    const topicCounts = new Map<string, number>()
    
    posts.forEach(post => {
      post.metadata.tags.forEach(tag => {
        topicCounts.set(tag.name, (topicCounts.get(tag.name) || 0) + 1)
      })
    })

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic)
  }

  private static calculateBestPostingTimes(posts: ProcessedPost[]): Date[] {
    // Analyze posting times vs engagement to find optimal times
    const hourEngagement = new Map<number, number[]>()
    
    posts.forEach(post => {
      const hour = post.metadata.publishedAt.getHours()
      if (!hourEngagement.has(hour)) {
        hourEngagement.set(hour, [])
      }
      hourEngagement.get(hour)!.push(post.engagement.engagementRate)
    })

    const bestHours = Array.from(hourEngagement.entries())
      .map(([hour, rates]) => ({
        hour,
        avgEngagement: rates.reduce((sum, rate) => sum + rate, 0) / rates.length
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 3)
      .map(({ hour }) => {
        const date = new Date()
        date.setHours(hour, 0, 0, 0)
        return date
      })

    return bestHours
  }

  private static extractAudienceInterests(posts: ProcessedPost[]): string[] {
    return this.extractPopularTopics(posts)
  }

  private static analyzeEngagementPatterns(posts: ProcessedPost[]): Record<string, number> {
    // Analyze engagement patterns
    return {
      'morning_engagement': posts.filter(p => p.metadata.publishedAt.getHours() < 12).length,
      'afternoon_engagement': posts.filter(p => {
        const hour = p.metadata.publishedAt.getHours()
        return hour >= 12 && hour < 18
      }).length,
      'evening_engagement': posts.filter(p => p.metadata.publishedAt.getHours() >= 18).length,
    }
  }

  private static matchesQuery(post: ProcessedPost, query: string): boolean {
    return (
      post.content.title.toLowerCase().includes(query) ||
      post.content.description.toLowerCase().includes(query) ||
      post.metadata.tags.some(tag => tag.name.toLowerCase().includes(query)) ||
      post.author.username.toLowerCase().includes(query)
    )
  }

  private static userMatchesQuery(user: ProcessedUser, query: string): boolean {
    return (
      user.username.toLowerCase().includes(query) ||
      user.displayName.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    )
  }

  private static calculateSearchScore(post: ProcessedPost, query: string): number {
    let score = 0

    // Title match bonus
    if (post.content.title.toLowerCase().includes(query)) score += 50

    // Description match bonus
    if (post.content.description.toLowerCase().includes(query)) score += 30

    // Tag match bonus
    if (post.metadata.tags.some(tag => tag.name.toLowerCase().includes(query))) score += 20

    // Engagement bonus
    score += post.engagement.engagementRate

    // Quality bonus
    score += post.quality.contentScore * 10

    return score
  }

  private static calculateUserSearchScore(user: ProcessedUser, query: string): number {
    let score = 0

    // Username exact match bonus
    if (user.username.toLowerCase() === query) score += 100

    // Username contains bonus
    if (user.username.toLowerCase().includes(query)) score += 50

    // Display name bonus
    if (user.displayName.toLowerCase().includes(query)) score += 30

    // Bio bonus
    if (user.bio.toLowerCase().includes(query)) score += 10

    // Influence bonus
    score += user.social.activityScore

    // Official bonus
    if (user.status.isOfficial) score += 20

    return score
  }
}