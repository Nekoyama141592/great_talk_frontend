/**
 * KNOWLEDGE LAYER - Business Rules Engine
 * Applies domain-specific business logic and rules
 */

import { ProcessedUser, ProcessedPost, ProcessedAIInteraction } from '../../information/models/processed-data'

export interface BusinessRule<T = any> {
  id: string
  name: string
  description: string
  priority: number
  conditions: RuleCondition<T>[]
  actions: RuleAction<T>[]
  isActive: boolean
}

export interface RuleCondition<T> {
  field: keyof T | string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'regex' | 'in' | 'not_in'
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface RuleAction<T> {
  type: 'modify' | 'flag' | 'restrict' | 'enhance' | 'notify' | 'log'
  target: keyof T | string
  value?: any
  metadata?: Record<string, any>
}

export interface RuleExecutionResult<T> {
  ruleId: string
  executed: boolean
  result: T
  actionsApplied: RuleAction<T>[]
  metadata: {
    executionTime: number
    timestamp: Date
    context: Record<string, any>
  }
}

export class BusinessRulesEngine {
  private rules: Map<string, BusinessRule[]> = new Map()

  constructor() {
    this.initializeDefaultRules()
  }

  /**
   * Register business rules for a specific entity type
   */
  registerRules(entityType: string, rules: BusinessRule[]): void {
    const existingRules = this.rules.get(entityType) || []
    this.rules.set(entityType, [...existingRules, ...rules])
  }

  /**
   * Execute business rules for user entities
   */
  executeUserRules(user: ProcessedUser, context: Record<string, any> = {}): RuleExecutionResult<ProcessedUser>[] {
    return this.executeRules('user', user, context)
  }

  /**
   * Execute business rules for post entities
   */
  executePostRules(post: ProcessedPost, context: Record<string, any> = {}): RuleExecutionResult<ProcessedPost>[] {
    return this.executeRules('post', post, context)
  }

  /**
   * Execute business rules for AI interactions
   */
  executeAIInteractionRules(
    interaction: ProcessedAIInteraction, 
    context: Record<string, any> = {}
  ): RuleExecutionResult<ProcessedAIInteraction>[] {
    return this.executeRules('ai_interaction', interaction, context)
  }

  /**
   * Execute content moderation rules
   */
  executeModerationRules(content: ProcessedPost | ProcessedUser): {
    isApproved: boolean
    flags: string[]
    confidence: number
    reasons: string[]
  } {
    const flags: string[] = []
    const reasons: string[] = []
    let confidence = 1.0

    // Content quality rules
    if ('quality' in content && content.quality.contentScore < 0.3) {
      flags.push('low_quality')
      reasons.push('Content quality score below threshold')
      confidence -= 0.3
    }

    // Safety rules
    if ('quality' in content && content.quality.aiSafetyScore < 0.7) {
      flags.push('safety_concern')
      reasons.push('AI safety score indicates potential issues')
      confidence -= 0.4
    }

    // User report rules
    if ('quality' in content && content.quality.userReportCount > 3) {
      flags.push('user_reported')
      reasons.push('Multiple user reports received')
      confidence -= 0.5
    }

    // Spam detection rules
    if (this.detectSpam(content)) {
      flags.push('spam')
      reasons.push('Content matches spam patterns')
      confidence -= 0.6
    }

    return {
      isApproved: flags.length === 0 && confidence > 0.5,
      flags,
      confidence: Math.max(0, confidence),
      reasons
    }
  }

  /**
   * Execute recommendation rules
   */
  executeRecommendationRules(
    user: ProcessedUser,
    availablePosts: ProcessedPost[]
  ): ProcessedPost[] {
    const recommendations: ProcessedPost[] = []
    
    // Interest-based recommendations
    const userInterests = this.extractUserInterests(user)
    const interestPosts = availablePosts.filter(post =>
      post.metadata.tags.some(tag => userInterests.includes(tag.name))
    )

    // Quality filter
    const qualityPosts = interestPosts.filter(post =>
      post.quality.contentScore > 0.6 && post.quality.moderationFlags.length === 0
    )

    // Engagement filter
    const engagingPosts = qualityPosts.filter(post =>
      post.engagement.engagementRate > 10
    )

    // Diversity rules
    const diversePosts = this.ensureDiversity(engagingPosts)

    return diversePosts.slice(0, 10)
  }

  /**
   * Execute access control rules
   */
  executeAccessControlRules(
    user: ProcessedUser,
    resource: ProcessedPost | ProcessedUser,
    action: 'read' | 'write' | 'delete' | 'moderate'
  ): {
    allowed: boolean
    reason?: string
    restrictions?: string[]
  } {
    // Suspension rules
    if (user.status.isSuspended) {
      return {
        allowed: false,
        reason: 'User is currently suspended',
        restrictions: ['no_posting', 'no_interaction']
      }
    }

    // Privacy rules
    if ('privacy' in resource && resource.privacy.profileVisibility === 'private') {
      if ('uid' in resource && resource.uid !== user.uid) {
        return {
          allowed: false,
          reason: 'Private profile access denied'
        }
      }
    }

    // Moderation rules
    if (action === 'moderate' && !user.status.isOfficial) {
      return {
        allowed: false,
        reason: 'Insufficient privileges for moderation'
      }
    }

    // Rate limiting rules
    if (action === 'write' && this.isRateLimited(user)) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        restrictions: ['wait_period']
      }
    }

    return { allowed: true }
  }

  // Private methods

  private executeRules<T>(
    entityType: string,
    entity: T,
    context: Record<string, any>
  ): RuleExecutionResult<T>[] {
    const rules = this.rules.get(entityType) || []
    const results: RuleExecutionResult<T>[] = []

    for (const rule of rules.filter(r => r.isActive)) {
      const startTime = performance.now()
      
      if (this.evaluateConditions(rule.conditions, entity, context)) {
        const modifiedEntity = this.applyActions(rule.actions, entity)
        const executionTime = performance.now() - startTime

        results.push({
          ruleId: rule.id,
          executed: true,
          result: modifiedEntity,
          actionsApplied: rule.actions,
          metadata: {
            executionTime,
            timestamp: new Date(),
            context
          }
        })
      }
    }

    return results
  }

  private evaluateConditions<T>(
    conditions: RuleCondition<T>[],
    entity: T,
    context: Record<string, any>
  ): boolean {
    if (conditions.length === 0) return true

    let result = true
    let currentLogicalOp: 'AND' | 'OR' = 'AND'

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, entity, context)
      
      if (currentLogicalOp === 'AND') {
        result = result && conditionResult
      } else {
        result = result || conditionResult
      }

      currentLogicalOp = condition.logicalOperator || 'AND'
    }

    return result
  }

  private evaluateCondition<T>(
    condition: RuleCondition<T>,
    entity: T,
    context: Record<string, any>
  ): boolean {
    const value = this.getNestedValue(entity, condition.field as string) ?? 
                  context[condition.field as string]

    switch (condition.operator) {
      case 'equals':
        return value === condition.value
      case 'not_equals':
        return value !== condition.value
      case 'greater_than':
        return Number(value) > Number(condition.value)
      case 'less_than':
        return Number(value) < Number(condition.value)
      case 'contains':
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase())
      case 'regex':
        return new RegExp(condition.value).test(String(value))
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value)
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value)
      default:
        return false
    }
  }

  private applyActions<T>(actions: RuleAction<T>[], entity: T): T {
    let result = { ...entity }

    for (const action of actions) {
      switch (action.type) {
        case 'modify':
          result = this.setNestedValue(result, action.target as string, action.value)
          break
        case 'flag':
          // Add flag to entity metadata
          if ('metadata' in result && typeof result.metadata === 'object') {
            (result.metadata as any).flags = [
              ...((result.metadata as any).flags || []),
              action.value
            ]
          }
          break
        case 'enhance':
          // Add enhancement data
          if ('enrichments' in result && typeof result.enrichments === 'object') {
            (result.enrichments as any)[action.target as string] = action.value
          }
          break
      }
    }

    return result
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private setNestedValue<T>(obj: T, path: string, value: any): T {
    const keys = path.split('.')
    const result = { ...obj }
    let current = result as any

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    return result
  }

  private detectSpam(content: ProcessedPost | ProcessedUser): boolean {
    if ('content' in content) {
      const post = content as ProcessedPost
      // Simple spam detection rules
      const suspiciousPatterns = [
        /click here/i,
        /buy now/i,
        /limited time/i,
        /urgent/i,
        /free money/i,
        /(http[s]?:\/\/[^\s]+){3,}/g // Multiple URLs
      ]

      return suspiciousPatterns.some(pattern => 
        pattern.test(post.content.title) || pattern.test(post.content.description)
      )
    }

    return false
  }

  private extractUserInterests(user: ProcessedUser): string[] {
    // This would analyze user's historical interactions, posts, etc.
    // For now, return default interests based on user level
    const baseInterests = ['technology', 'ai', 'discussion']
    
    if (user.social.influenceLevel === 'influencer' || user.social.influenceLevel === 'celebrity') {
      return [...baseInterests, 'trending', 'popular']
    }

    return baseInterests
  }

  private ensureDiversity(posts: ProcessedPost[]): ProcessedPost[] {
    const diversePosts: ProcessedPost[] = []
    const usedCategories = new Set<string>()
    const usedAuthors = new Set<string>()

    for (const post of posts) {
      const postCategories = post.metadata.categories
      const authorId = post.author.uid

      // Ensure category diversity
      if (postCategories.length === 0 || 
          postCategories.some(cat => !usedCategories.has(cat)) ||
          usedCategories.size < 3) {
        
        // Ensure author diversity
        if (!usedAuthors.has(authorId) || usedAuthors.size < posts.length / 2) {
          diversePosts.push(post)
          postCategories.forEach(cat => usedCategories.add(cat))
          usedAuthors.add(authorId)
        }
      }
    }

    return diversePosts
  }

  private isRateLimited(user: ProcessedUser): boolean {
    // Simple rate limiting logic - would be more sophisticated in practice
    const recentActivity = user.social.activityScore
    const maxActivity = user.social.influenceLevel === 'newcomer' ? 10 : 50
    
    return recentActivity > maxActivity
  }

  private initializeDefaultRules(): void {
    // User rules
    this.registerRules('user', [
      {
        id: 'user_verification',
        name: 'User Verification Rule',
        description: 'Automatically verify users with high engagement',
        priority: 1,
        conditions: [
          { field: 'stats.followers', operator: 'greater_than', value: 10000 },
          { field: 'social.activityScore', operator: 'greater_than', value: 80, logicalOperator: 'AND' }
        ],
        actions: [
          { type: 'modify', target: 'status.verification.isVerified', value: true },
          { type: 'modify', target: 'status.verification.verificationBadge', value: '✓' }
        ],
        isActive: true
      }
    ])

    // Post rules
    this.registerRules('post', [
      {
        id: 'trending_detection',
        name: 'Trending Post Detection',
        description: 'Mark posts as trending based on engagement',
        priority: 1,
        conditions: [
          { field: 'engagement.engagementRate', operator: 'greater_than', value: 50 },
          { field: 'engagement.interactions', operator: 'greater_than', value: 100, logicalOperator: 'AND' }
        ],
        actions: [
          { type: 'modify', target: 'metadata.isTrending', value: true },
          { type: 'enhance', target: 'trending_detected_at', value: new Date() }
        ],
        isActive: true
      }
    ])
  }
}