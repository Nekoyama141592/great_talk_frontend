/**
 * KNOWLEDGE LAYER - Content Recommendation Engine
 * Intelligent content recommendation using multiple algorithms
 */

import {
  ProcessedUser,
  ProcessedPost,
  ProcessedAIInteraction,
} from '../../information/models/processed-data'

export interface RecommendationRequest {
  userId: string
  context: RecommendationContext
  options: RecommendationOptions
}

export interface RecommendationContext {
  currentLocation?: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: string
  sessionDuration: number
  lastInteractions: string[]
  device: 'mobile' | 'desktop' | 'tablet'
  networkCondition?: 'fast' | 'slow'
}

export interface RecommendationOptions {
  maxItems: number
  diversityWeight: number // 0-1, how much to prioritize diversity
  noveltyWeight: number // 0-1, how much to prioritize new content
  personalWeight: number // 0-1, how much to prioritize personal preferences
  excludeIds?: string[]
  includeTrending?: boolean
  includeFollowing?: boolean
}

export interface RecommendationResult {
  posts: ScoredPost[]
  algorithm: string
  confidence: number
  explanation: string[]
  metadata: {
    totalCandidates: number
    processingTime: number
    factorsUsed: string[]
  }
}

export interface ScoredPost {
  post: ProcessedPost
  score: number
  reasons: string[]
  algorithm: RecommendationAlgorithm
}

export enum RecommendationAlgorithm {
  COLLABORATIVE_FILTERING = 'collaborative_filtering',
  CONTENT_BASED = 'content_based',
  HYBRID = 'hybrid',
  TRENDING = 'trending',
  SOCIAL = 'social',
  AI_ENHANCED = 'ai_enhanced',
}

export class ContentRecommendationEngine {
  /**
   * Generate personalized content recommendations
   */
  async generateRecommendations(
    request: RecommendationRequest,
    user: ProcessedUser,
    allPosts: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[],
    followingUsers: ProcessedUser[]
  ): Promise<RecommendationResult> {
    const startTime = performance.now()

    // Get candidate posts
    const candidates = this.getCandidatePosts(allPosts, request.options)

    // Apply different recommendation algorithms
    const algorithms = this.selectAlgorithms(
      user,
      request.context,
      request.options
    )
    const scoredResults = await Promise.all(
      algorithms.map(algo =>
        this.applyAlgorithm(
          algo,
          user,
          candidates,
          userInteractions,
          followingUsers,
          request.context
        )
      )
    )

    // Combine results using ensemble method
    const combinedResults = this.combineAlgorithmResults(
      scoredResults,
      request.options
    )

    // Apply final filters and ranking
    const finalPosts = this.applyFinalFilters(combinedResults, request.options)

    const processingTime = performance.now() - startTime

    return {
      posts: finalPosts.slice(0, request.options.maxItems),
      algorithm: 'ensemble',
      confidence: this.calculateConfidence(finalPosts, scoredResults),
      explanation: this.generateExplanation(finalPosts, algorithms),
      metadata: {
        totalCandidates: candidates.length,
        processingTime,
        factorsUsed: this.getFactorsUsed(algorithms, request.context),
      },
    }
  }

  /**
   * Get content recommendations for cold start users
   */
  generateColdStartRecommendations(
    user: ProcessedUser,
    allPosts: ProcessedPost[],
    options: RecommendationOptions
  ): ScoredPost[] {
    // For new users, rely on trending and quality content
    return allPosts
      .filter(
        post =>
          post.quality.contentScore > 0.7 &&
          post.engagement.engagementRate > 20 &&
          post.quality.moderationFlags.length === 0
      )
      .map(post => ({
        post,
        score: this.calculateColdStartScore(post),
        reasons: [
          'High quality content',
          'Popular with community',
          'Safe for new users',
        ],
        algorithm: RecommendationAlgorithm.TRENDING,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, options.maxItems)
  }

  /**
   * Generate similar content recommendations
   */
  generateSimilarContent(
    targetPost: ProcessedPost,
    allPosts: ProcessedPost[],
    maxItems: number = 5
  ): ScoredPost[] {
    return allPosts
      .filter(post => post.postId !== targetPost.postId)
      .map(post => ({
        post,
        score: this.calculateSimilarityScore(targetPost, post),
        reasons: this.getSimilarityReasons(targetPost, post),
        algorithm: RecommendationAlgorithm.CONTENT_BASED,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
  }

  // Private methods

  private getCandidatePosts(
    allPosts: ProcessedPost[],
    options: RecommendationOptions
  ): ProcessedPost[] {
    let candidates = allPosts.filter(
      post =>
        post.metadata.isPublic &&
        !options.excludeIds?.includes(post.postId) &&
        post.quality.moderationFlags.length === 0
    )

    // Apply basic quality filter
    candidates = candidates.filter(post => post.quality.contentScore > 0.3)

    return candidates
  }

  private selectAlgorithms(
    user: ProcessedUser,
    context: RecommendationContext,
    options: RecommendationOptions
  ): RecommendationAlgorithm[] {
    const algorithms: RecommendationAlgorithm[] = []

    // Always include content-based
    algorithms.push(RecommendationAlgorithm.CONTENT_BASED)

    // Add collaborative filtering for users with sufficient history
    if (user.stats.posts > 5 || user.social.activityScore > 30) {
      algorithms.push(RecommendationAlgorithm.COLLABORATIVE_FILTERING)
    }

    // Add social recommendations if following users
    if (options.includeFollowing) {
      algorithms.push(RecommendationAlgorithm.SOCIAL)
    }

    // Add trending for discovery
    if (options.includeTrending) {
      algorithms.push(RecommendationAlgorithm.TRENDING)
    }

    // Add AI-enhanced for power users
    if (user.social.influenceLevel !== 'newcomer') {
      algorithms.push(RecommendationAlgorithm.AI_ENHANCED)
    }

    return algorithms
  }

  private async applyAlgorithm(
    algorithm: RecommendationAlgorithm,
    user: ProcessedUser,
    candidates: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[],
    followingUsers: ProcessedUser[],
    context: RecommendationContext
  ): Promise<ScoredPost[]> {
    switch (algorithm) {
      case RecommendationAlgorithm.CONTENT_BASED:
        return this.applyContentBasedFiltering(
          user,
          candidates,
          userInteractions
        )

      case RecommendationAlgorithm.COLLABORATIVE_FILTERING:
        return this.applyCollaborativeFiltering(
          user,
          candidates,
          userInteractions
        )

      case RecommendationAlgorithm.SOCIAL:
        return this.applySocialRecommendations(user, candidates, followingUsers)

      case RecommendationAlgorithm.TRENDING:
        return this.applyTrendingRecommendations(candidates, context)

      case RecommendationAlgorithm.AI_ENHANCED:
        return this.applyAIEnhancedRecommendations(
          user,
          candidates,
          userInteractions
        )

      default:
        return []
    }
  }

  private applyContentBasedFiltering(
    user: ProcessedUser,
    candidates: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[]
  ): ScoredPost[] {
    // Extract user preferences from interactions
    const userTopics = this.extractUserTopics(userInteractions)
    // Extract language style for potential future use
    // const userLanguageStyle = this.extractLanguageStyle(userInteractions)

    return candidates.map(post => {
      let score = 0
      const reasons: string[] = []

      // Topic similarity
      const topicScore = this.calculateTopicSimilarity(
        userTopics,
        post.metadata.tags.map(t => t.name)
      )
      score += topicScore * 40
      if (topicScore > 0.5) reasons.push('Matches your interests')

      // Quality bonus
      score += post.quality.contentScore * 20
      if (post.quality.contentScore > 0.8) reasons.push('High quality content')

      // Engagement bonus
      score += Math.min((post.engagement.engagementRate / 100) * 20, 20)
      if (post.engagement.engagementRate > 50)
        reasons.push('Popular with community')

      // AI complexity match
      if (post.ai.systemPrompt.length > 100 && userInteractions.length > 5) {
        score += 10
        reasons.push('Complex AI interactions available')
      }

      return {
        post,
        score,
        reasons,
        algorithm: RecommendationAlgorithm.CONTENT_BASED,
      }
    })
  }

  private applyCollaborativeFiltering(
    user: ProcessedUser,
    candidates: ProcessedPost[],
    _userInteractions: ProcessedAIInteraction[]
  ): ScoredPost[] {
    // Simplified collaborative filtering
    // In practice, this would use user-item interaction matrices
    return candidates.map(post => {
      let score = 0
      const reasons: string[] = []

      // Users with similar engagement patterns liked this
      if (post.engagement.engagementRate > user.stats.engagementRate) {
        score += 30
        reasons.push('Users like you enjoyed this')
      }

      // Similar user activity level
      const authorActivityLevel = this.getUserActivityLevel(post.author.uid)
      if (authorActivityLevel === user.social.influenceLevel) {
        score += 20
        reasons.push('From similar user level')
      }

      return {
        post,
        score,
        reasons,
        algorithm: RecommendationAlgorithm.COLLABORATIVE_FILTERING,
      }
    })
  }

  private applySocialRecommendations(
    user: ProcessedUser,
    candidates: ProcessedPost[],
    followingUsers: ProcessedUser[]
  ): ScoredPost[] {
    const followingUids = new Set(followingUsers.map(u => u.uid))

    return candidates
      .filter(post => followingUids.has(post.author.uid))
      .map(post => {
        let score = 50 // Base score for following
        const reasons = ['From someone you follow']

        // Boost for recent posts
        const hoursOld =
          (Date.now() - post.metadata.publishedAt.getTime()) / (1000 * 60 * 60)
        if (hoursOld < 24) {
          score += 20
          reasons.push('Recent post')
        }

        // Boost for high engagement
        if (post.engagement.engagementRate > 30) {
          score += 15
          reasons.push('Getting good engagement')
        }

        return {
          post,
          score,
          reasons,
          algorithm: RecommendationAlgorithm.SOCIAL,
        }
      })
  }

  private applyTrendingRecommendations(
    candidates: ProcessedPost[],
    context: RecommendationContext
  ): ScoredPost[] {
    return candidates
      .filter(
        post => post.metadata.isTrending || post.engagement.trendingScore > 70
      )
      .map(post => {
        let score = post.engagement.trendingScore
        const reasons = ['Trending now']

        // Time-based boost
        if (
          context.timeOfDay === 'evening' &&
          post.engagement.engagementRate > 40
        ) {
          score += 10
          reasons.push('Popular this evening')
        }

        return {
          post,
          score,
          reasons,
          algorithm: RecommendationAlgorithm.TRENDING,
        }
      })
  }

  private applyAIEnhancedRecommendations(
    user: ProcessedUser,
    candidates: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[]
  ): ScoredPost[] {
    // Advanced AI-based recommendations
    return candidates.map(post => {
      let score = 0
      const reasons: string[] = []

      // AI interaction quality
      if (post.ai.responseCount > 10 && post.ai.averageResponseTime < 3000) {
        score += 25
        reasons.push('Great AI conversations')
      }

      // Complex system prompts for advanced users
      if (post.ai.systemPrompt.length > 200 && user.social.activityScore > 60) {
        score += 20
        reasons.push('Advanced AI capabilities')
      }

      // Semantic similarity (simplified)
      const semanticScore = this.calculateSemanticSimilarity(
        userInteractions,
        post
      )
      score += semanticScore * 30
      if (semanticScore > 0.7) reasons.push('AI-detected relevance')

      return {
        post,
        score,
        reasons,
        algorithm: RecommendationAlgorithm.AI_ENHANCED,
      }
    })
  }

  private combineAlgorithmResults(
    results: ScoredPost[][],
    _options: RecommendationOptions
  ): ScoredPost[] {
    const postScores = new Map<
      string,
      {
        post: ProcessedPost
        totalScore: number
        reasons: Set<string>
        algorithms: Set<RecommendationAlgorithm>
      }
    >()

    // Combine scores from all algorithms
    results.forEach(algorithmResults => {
      algorithmResults.forEach(scoredPost => {
        const existing = postScores.get(scoredPost.post.postId)
        if (existing) {
          existing.totalScore += scoredPost.score
          scoredPost.reasons.forEach(reason => existing.reasons.add(reason))
          existing.algorithms.add(scoredPost.algorithm)
        } else {
          postScores.set(scoredPost.post.postId, {
            post: scoredPost.post,
            totalScore: scoredPost.score,
            reasons: new Set(scoredPost.reasons),
            algorithms: new Set([scoredPost.algorithm]),
          })
        }
      })
    })

    // Convert back to ScoredPost array
    return Array.from(postScores.values()).map(item => ({
      post: item.post,
      score: item.totalScore,
      reasons: Array.from(item.reasons),
      algorithm:
        item.algorithms.size > 1
          ? RecommendationAlgorithm.HYBRID
          : Array.from(item.algorithms)[0],
    }))
  }

  private applyFinalFilters(
    scoredPosts: ScoredPost[],
    options: RecommendationOptions
  ): ScoredPost[] {
    let filtered = scoredPosts

    // Apply diversity filter
    if (options.diversityWeight > 0) {
      filtered = this.applyDiversityFilter(filtered, options.diversityWeight)
    }

    // Apply novelty filter
    if (options.noveltyWeight > 0) {
      filtered = this.applyNoveltyFilter(filtered, options.noveltyWeight)
    }

    // Sort by final score
    return filtered.sort((a, b) => b.score - a.score)
  }

  private applyDiversityFilter(
    posts: ScoredPost[],
    weight: number
  ): ScoredPost[] {
    const diversePosts: ScoredPost[] = []
    const usedCategories = new Set<string>()
    const usedAuthors = new Set<string>()

    for (const scoredPost of posts) {
      const categories = scoredPost.post.metadata.categories
      const authorId = scoredPost.post.author.uid

      let diversityBonus = 0

      // Category diversity bonus
      if (categories.some(cat => !usedCategories.has(cat))) {
        diversityBonus += weight * 10
      }

      // Author diversity bonus
      if (!usedAuthors.has(authorId)) {
        diversityBonus += weight * 5
      }

      const adjustedPost = {
        ...scoredPost,
        score: scoredPost.score + diversityBonus,
      }

      diversePosts.push(adjustedPost)
      categories.forEach(cat => usedCategories.add(cat))
      usedAuthors.add(authorId)
    }

    return diversePosts
  }

  private applyNoveltyFilter(
    posts: ScoredPost[],
    weight: number
  ): ScoredPost[] {
    const now = Date.now()

    return posts.map(scoredPost => {
      const ageInHours =
        (now - scoredPost.post.metadata.publishedAt.getTime()) /
        (1000 * 60 * 60)
      const noveltyBonus = ((weight * Math.max(0, 24 - ageInHours)) / 24) * 10

      return {
        ...scoredPost,
        score: scoredPost.score + noveltyBonus,
      }
    })
  }

  // Helper methods

  private calculateColdStartScore(post: ProcessedPost): number {
    return (
      post.quality.contentScore * 30 +
      Math.min((post.engagement.engagementRate / 100) * 40, 40) +
      (post.author.isOfficial ? 20 : 0) +
      (post.metadata.isTrending ? 10 : 0)
    )
  }

  private calculateSimilarityScore(
    targetPost: ProcessedPost,
    candidatePost: ProcessedPost
  ): number {
    let score = 0

    // Tag similarity
    const tagSimilarity = this.calculateTopicSimilarity(
      targetPost.metadata.tags.map(t => t.name),
      candidatePost.metadata.tags.map(t => t.name)
    )
    score += tagSimilarity * 40

    // Category similarity
    const categorySimilarity = this.calculateArraySimilarity(
      targetPost.metadata.categories,
      candidatePost.metadata.categories
    )
    score += categorySimilarity * 30

    // AI complexity similarity
    const complexitySimilarity =
      Math.abs(
        targetPost.ai.systemPrompt.length - candidatePost.ai.systemPrompt.length
      ) /
      Math.max(
        targetPost.ai.systemPrompt.length,
        candidatePost.ai.systemPrompt.length
      )
    score += (1 - complexitySimilarity) * 20

    // Quality similarity
    const qualitySimilarity =
      1 -
      Math.abs(
        targetPost.quality.contentScore - candidatePost.quality.contentScore
      )
    score += qualitySimilarity * 10

    return score
  }

  private getSimilarityReasons(
    targetPost: ProcessedPost,
    candidatePost: ProcessedPost
  ): string[] {
    const reasons: string[] = []

    const commonTags = targetPost.metadata.tags.filter(tag =>
      candidatePost.metadata.tags.some(ct => ct.name === tag.name)
    )
    if (commonTags.length > 0) {
      reasons.push(`Similar topics: ${commonTags.map(t => t.name).join(', ')}`)
    }

    if (targetPost.author.uid === candidatePost.author.uid) {
      reasons.push('Same author')
    }

    if (
      Math.abs(
        targetPost.quality.contentScore - candidatePost.quality.contentScore
      ) < 0.2
    ) {
      reasons.push('Similar quality level')
    }

    return reasons
  }

  private extractUserTopics(interactions: ProcessedAIInteraction[]): string[] {
    // Extract topics from user's AI interactions
    const topicCounts = new Map<string, number>()

    interactions.forEach(interaction => {
      // Simple keyword extraction from prompts
      const words = interaction.conversation.userPrompt
        .toLowerCase()
        .split(/\s+/)
      words.forEach(word => {
        if (word.length > 3) {
          topicCounts.set(word, (topicCounts.get(word) || 0) + 1)
        }
      })
    })

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic)
  }

  private extractLanguageStyle(interactions: ProcessedAIInteraction[]): string {
    // Analyze user's language style from interactions
    if (interactions.length === 0) return 'casual'

    const totalLength = interactions.reduce(
      (sum, i) => sum + i.conversation.userPrompt.length,
      0
    )
    const avgLength = totalLength / interactions.length

    if (avgLength > 200) return 'detailed'
    if (avgLength > 100) return 'moderate'
    return 'casual'
  }

  private calculateTopicSimilarity(
    topics1: string[],
    topics2: string[]
  ): number {
    if (topics1.length === 0 || topics2.length === 0) return 0

    const set1 = new Set(topics1.map(t => t.toLowerCase()))
    const set2 = new Set(topics2.map(t => t.toLowerCase()))

    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return intersection.size / union.size
  }

  private calculateArraySimilarity(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 || arr2.length === 0) return 0

    const set1 = new Set(arr1)
    const set2 = new Set(arr2)

    const intersection = new Set([...set1].filter(x => set2.has(x)))

    return intersection.size / Math.max(set1.size, set2.size)
  }

  private getUserActivityLevel(_uid: string): string {
    // This would look up the user's activity level
    // For now, return a default
    return 'regular'
  }

  private calculateSemanticSimilarity(
    interactions: ProcessedAIInteraction[],
    post: ProcessedPost
  ): number {
    // Simplified semantic similarity - would use embeddings in practice
    const userText = interactions.map(i => i.conversation.userPrompt).join(' ')
    const postText = `${post.content.title} ${post.content.description} ${post.ai.systemPrompt}`

    // Simple word overlap similarity
    const userWords = new Set(userText.toLowerCase().split(/\s+/))
    const postWords = new Set(postText.toLowerCase().split(/\s+/))

    const intersection = new Set([...userWords].filter(x => postWords.has(x)))

    return intersection.size / Math.max(userWords.size, postWords.size)
  }

  private calculateConfidence(
    finalPosts: ScoredPost[],
    _algorithmResults: ScoredPost[][]
  ): number {
    if (finalPosts.length === 0) return 0

    const avgScore =
      finalPosts.reduce((sum, post) => sum + post.score, 0) / finalPosts.length
    const maxPossibleScore = 100 // Assuming max score of 100

    return Math.min(avgScore / maxPossibleScore, 1)
  }

  private generateExplanation(
    posts: ScoredPost[],
    algorithms: RecommendationAlgorithm[]
  ): string[] {
    const explanations: string[] = []

    explanations.push(`Used ${algorithms.length} recommendation algorithms`)

    if (posts.length > 0) {
      const topReasons = posts[0].reasons
      explanations.push(`Top recommendation because: ${topReasons.join(', ')}`)
    }

    const algorithmNames = algorithms
      .map(algo => algo.replace('_', ' '))
      .join(', ')
    explanations.push(`Algorithms used: ${algorithmNames}`)

    return explanations
  }

  private getFactorsUsed(
    algorithms: RecommendationAlgorithm[],
    context: RecommendationContext
  ): string[] {
    const factors = [...algorithms]
    factors.push(`time_of_day:${context.timeOfDay}`)
    factors.push(`device:${context.device}`)

    if (context.sessionDuration > 300) {
      // 5 minutes
      factors.push('long_session')
    }

    return factors
  }
}
