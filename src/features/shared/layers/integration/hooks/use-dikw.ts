/**
 * INTEGRATION LAYER - React Hooks for DIKW Architecture
 * Easy integration of DIKW layers with React components
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { uidAtom, firstLoadedAtom } from '@atoms'
import {
  DIKWService,
  DIKWServiceOptions,
  UserExperienceResponse,
} from '@shared/layers/integration/dikw-service'
import {
  ProcessedUser,
  ProcessedPost,
  ProcessedAIInteraction,
} from '@shared/layers/information/models/processed-data'

// Hook options
export interface UseDIKWOptions extends DIKWServiceOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  enableRealTime?: boolean
}

// Hook return types
export interface DIKWHookReturn {
  // Service instance
  dikwService: DIKWService

  // Loading states
  isLoading: boolean
  isProcessing: boolean
  error: Error | null

  // Core data processing
  processUserExperience: (
    allPosts: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[],
    followingUsers: ProcessedUser[],
    context?: any
  ) => Promise<UserExperienceResponse | null>

  // Content recommendations
  getContentRecommendations: (
    user: ProcessedUser,
    allPosts: ProcessedPost[],
    userInteractions: ProcessedAIInteraction[],
    followingUsers: ProcessedUser[],
    context?: any
  ) => Promise<any>

  // System insights
  getSystemInsights: (
    users: ProcessedUser[],
    posts: ProcessedPost[],
    interactions: ProcessedAIInteraction[]
  ) => Promise<any>

  // Cached results
  lastUserExperience: UserExperienceResponse | null
  lastRecommendations: any
  lastInsights: any

  // Utility functions
  clearCache: () => void
  refreshData: () => void
}

/**
 * Main DIKW hook for comprehensive data processing
 */
export function useDIKW(options: UseDIKWOptions = {}): DIKWHookReturn {
  const uid = useAtomValue(uidAtom)
  const firstLoaded = useAtomValue(firstLoadedAtom)

  // Service instance (memoized)
  const dikwService = useMemo(() => new DIKWService(options), [options])

  // State management
  const [isLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUserExperience, setLastUserExperience] =
    useState<UserExperienceResponse | null>(null)
  const [lastRecommendations, setLastRecommendations] = useState<any>(null)
  const [lastInsights, setLastInsights] = useState<any>(null)

  // Process user experience
  const processUserExperience = useCallback(
    async (
      allPosts: ProcessedPost[],
      userInteractions: ProcessedAIInteraction[],
      followingUsers: ProcessedUser[],
      context: any = {}
    ): Promise<UserExperienceResponse | null> => {
      if (!uid || !firstLoaded) {
        return null
      }

      setIsProcessing(true)
      setError(null)

      try {
        const result = await dikwService.processUserExperience(
          uid,
          allPosts,
          userInteractions,
          followingUsers,
          context
        )

        setLastUserExperience(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [uid, firstLoaded, dikwService]
  )

  // Get content recommendations
  const getContentRecommendations = useCallback(
    async (
      user: ProcessedUser,
      allPosts: ProcessedPost[],
      userInteractions: ProcessedAIInteraction[],
      followingUsers: ProcessedUser[],
      context: any = {}
    ) => {
      setIsProcessing(true)
      setError(null)

      try {
        const result = await dikwService.processContentRecommendations(
          user,
          allPosts,
          userInteractions,
          followingUsers,
          context
        )

        setLastRecommendations(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [dikwService]
  )

  // Get system insights
  const getSystemInsights = useCallback(
    async (
      users: ProcessedUser[],
      posts: ProcessedPost[],
      interactions: ProcessedAIInteraction[]
    ) => {
      setIsProcessing(true)
      setError(null)

      try {
        const result = await dikwService.getSystemInsights(
          users,
          posts,
          interactions
        )
        setLastInsights(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [dikwService]
  )

  // Utility functions
  const clearCache = useCallback(() => {
    setLastUserExperience(null)
    setLastRecommendations(null)
    setLastInsights(null)
    setError(null)
  }, [])

  const refreshData = useCallback(() => {
    // Trigger refresh of current data
    if (lastUserExperience) {
      // Would re-fetch with same parameters
    }
  }, [lastUserExperience])

  // Auto-refresh effect
  useEffect(() => {
    if (options.autoRefresh && options.refreshInterval && lastUserExperience) {
      const interval = setInterval(() => {
        refreshData()
      }, options.refreshInterval)

      return () => clearInterval(interval)
    }
  }, [
    options.autoRefresh,
    options.refreshInterval,
    refreshData,
    lastUserExperience,
  ])

  return {
    dikwService,
    isLoading,
    isProcessing,
    error,
    processUserExperience,
    getContentRecommendations,
    getSystemInsights,
    lastUserExperience,
    lastRecommendations,
    lastInsights,
    clearCache,
    refreshData,
  }
}

/**
 * Hook for user-specific DIKW processing
 */
export function useUserDIKW(options: UseDIKWOptions = {}) {
  const uid = useAtomValue(uidAtom)
  const dikw = useDIKW(options)

  const [processedUser, setProcessedUser] = useState<ProcessedUser | null>(null)
  const [userRecommendations, setUserRecommendations] = useState<any>(null)

  // Process current user
  const processCurrentUser = useCallback(
    async (
      allPosts: ProcessedPost[],
      userInteractions: ProcessedAIInteraction[],
      followingUsers: ProcessedUser[],
      context: any = {}
    ) => {
      if (!uid) return null

      const result = await dikw.processUserExperience(
        allPosts,
        userInteractions,
        followingUsers,
        context
      )

      if (result) {
        setProcessedUser(result.processedUser)
        setUserRecommendations(result.recommendations)
      }

      return result
    },
    [uid, dikw]
  )

  return {
    ...dikw,
    processedUser,
    userRecommendations,
    processCurrentUser,
  }
}

/**
 * Hook for content recommendations
 */
export function useContentRecommendations(options: UseDIKWOptions = {}) {
  const dikw = useDIKW(options)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false)

  const getRecommendations = useCallback(
    async (
      user: ProcessedUser,
      allPosts: ProcessedPost[],
      userInteractions: ProcessedAIInteraction[],
      followingUsers: ProcessedUser[],
      context: any = {}
    ) => {
      setIsLoadingRecommendations(true)

      try {
        const result = await dikw.getContentRecommendations(
          user,
          allPosts,
          userInteractions,
          followingUsers,
          context
        )

        setRecommendations(result)
        return result
      } finally {
        setIsLoadingRecommendations(false)
      }
    },
    [dikw]
  )

  const refreshRecommendations = useCallback(() => {
    // Would refresh with last parameters
    setRecommendations(null)
  }, [])

  return {
    recommendations,
    isLoadingRecommendations,
    getRecommendations,
    refreshRecommendations,
    error: dikw.error,
  }
}

/**
 * Hook for business rules and moderation
 */
export function useBusinessRules(options: UseDIKWOptions = {}) {
  const dikw = useDIKW(options)
  const [moderationResults, setModerationResults] = useState<any>(null)

  const checkContentModeration = useCallback(
    (content: ProcessedPost | ProcessedUser) => {
      const result =
        dikw.dikwService['businessRulesEngine'].executeModerationRules(content)
      setModerationResults(result)
      return result
    },
    [dikw.dikwService]
  )

  const executeUserRules = useCallback(
    (user: ProcessedUser, context: any = {}) => {
      return dikw.dikwService['businessRulesEngine'].executeUserRules(
        user,
        context
      )
    },
    [dikw.dikwService]
  )

  const executePostRules = useCallback(
    (post: ProcessedPost, context: any = {}) => {
      return dikw.dikwService['businessRulesEngine'].executePostRules(
        post,
        context
      )
    },
    [dikw.dikwService]
  )

  return {
    moderationResults,
    checkContentModeration,
    executeUserRules,
    executePostRules,
  }
}

/**
 * Hook for strategic insights and decisions
 */
export function useStrategicInsights(options: UseDIKWOptions = {}) {
  const dikw = useDIKW({ ...options, enableWisdomLayer: true })
  const [strategicDecisions, setStrategicDecisions] = useState<any>(null)
  const [aiAdvice, setAiAdvice] = useState<any>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)

  const getStrategicDecisions = useCallback(
    async (
      users: ProcessedUser[],
      posts: ProcessedPost[],
      interactions: ProcessedAIInteraction[]
    ) => {
      setIsLoadingInsights(true)

      try {
        const insights = await dikw.getSystemInsights(
          users,
          posts,
          interactions
        )
        setStrategicDecisions(insights.strategicRecommendations)
        return insights.strategicRecommendations
      } finally {
        setIsLoadingInsights(false)
      }
    },
    [dikw]
  )

  const getAIAdvice = useCallback(
    async (domain: string, context: any) => {
      if (!dikw.dikwService['aiAdvisor']) return null

      setIsLoadingInsights(true)

      try {
        const advice = await dikw.dikwService['aiAdvisor'].getAdvice({
          domain: domain as any,
          context,
          priority: 'medium',
          timeframe: 'short_term',
        })

        setAiAdvice(advice)
        return advice
      } finally {
        setIsLoadingInsights(false)
      }
    },
    [dikw.dikwService]
  )

  return {
    strategicDecisions,
    aiAdvice,
    isLoadingInsights,
    getStrategicDecisions,
    getAIAdvice,
    error: dikw.error,
  }
}

/**
 * Hook for real-time DIKW processing
 */
export function useRealTimeDIKW(options: UseDIKWOptions = {}) {
  const dikw = useDIKW({ ...options, enableRealTime: true })
  const [realTimeInsights] = useState<any>(null)

  useEffect(() => {
    if (!options.enableRealTime) return

    // Set up real-time processing
    const interval = setInterval(() => {
      // Process real-time insights
      // This would connect to real-time data streams
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [options.enableRealTime])

  return {
    ...dikw,
    realTimeInsights,
  }
}

/**
 * Hook for performance monitoring of DIKW layers
 */
export function useDIKWPerformance() {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    dataLayerTime: 0,
    informationLayerTime: 0,
    knowledgeLayerTime: 0,
    wisdomLayerTime: 0,
    totalTime: 0,
  })

  const measurePerformance = useCallback(
    async (operation: () => Promise<any>) => {
      const startTime = performance.now()

      try {
        const result = await operation()
        const endTime = performance.now()

        setPerformanceMetrics(prev => ({
          ...prev,
          totalTime: endTime - startTime,
        }))

        return result
      } catch (error) {
        throw error
      }
    },
    []
  )

  return {
    performanceMetrics,
    measurePerformance,
  }
}

/**
 * Hook for DIKW cache management
 */
export function useDIKWCache() {
  const [cacheStats, setCacheStats] = useState({
    hitRate: 0,
    missRate: 0,
    size: 0,
    lastCleared: null as Date | null,
  })

  const clearCache = useCallback(() => {
    // Clear all DIKW caches
    setCacheStats(prev => ({
      ...prev,
      lastCleared: new Date(),
      size: 0,
    }))
  }, [])

  const getCacheStats = useCallback(() => {
    // Get cache statistics
    return cacheStats
  }, [cacheStats])

  return {
    cacheStats,
    clearCache,
    getCacheStats,
  }
}
