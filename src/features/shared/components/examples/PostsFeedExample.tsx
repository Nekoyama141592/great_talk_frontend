/**
 * EXAMPLE COMPONENT - Posts Feed using DIKW Architecture
 * Demonstrates how to integrate the DIKW layers into React components
 */

import React, { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import {
  useDIKW,
  useContentRecommendations,
} from '@shared/layers/integration/hooks/use-dikw'
import {
  ProcessedPost,
  ProcessedUser,
  ProcessedAIInteraction,
} from '@shared/layers/information/models/processed-data'

interface PostsFeedExampleProps {
  className?: string
}

export function PostsFeedExample({ className }: PostsFeedExampleProps) {
  const uid = useAtomValue(uidAtom)

  // Use DIKW hooks for intelligent content management
  const { processUserExperience, lastUserExperience, isProcessing, error } =
    useDIKW({
      enableWisdomLayer: true,
      enableAdvancedRecommendations: true,
      enableBusinessRules: true,
      cacheStrategy: 'memory',
    })

  const { recommendations, isLoadingRecommendations, getRecommendations } =
    useContentRecommendations()

  // Mock data - in real app, this would come from your data layer
  const [mockData, setMockData] = useState<{
    allPosts: ProcessedPost[]
    userInteractions: ProcessedAIInteraction[]
    followingUsers: ProcessedUser[]
  } | null>(null)

  // Load and process data using DIKW pipeline
  useEffect(() => {
    if (!uid) return

    const loadData = async () => {
      // This would normally fetch from your data sources
      const mockPosts: ProcessedPost[] = [
        {
          postId: '1',
          author: {
            uid: 'user1',
            displayName: 'Alice Chen',
            bio: 'AI researcher and developer',
            avatar: { url: '', alt: 'Alice avatar' },
            isOfficial: true,
            isVerified: true,
          },
          content: {
            title: 'Advanced AI Prompt Engineering Techniques',
            description:
              'Learn how to craft better prompts for more effective AI interactions.',
            body: 'This post explores various techniques for improving your AI prompts...',
            language: 'en',
            readingTime: 8,
          },
          metadata: {
            postType: 'article',
            categories: ['AI', 'Technology', 'Education'],
            tags: [
              { name: 'artificial-intelligence', category: 'technology' },
              { name: 'prompt-engineering', category: 'skill' },
            ],
            publishedAt: new Date('2024-01-15'),
            isPublic: true,
            isTrending: true,
            source: 'web',
          },
          engagement: {
            interactions: 125,
            engagementRate: 85,
            trendingScore: 92,
            socialShares: 45,
          },
          quality: {
            contentScore: 0.95,
            moderationFlags: [],
            readabilityScore: 0.88,
            credibilityScore: 0.92,
          },
          ai: {
            systemPrompt:
              'You are an expert AI assistant helping users learn prompt engineering...',
            responseCount: 34,
            averageResponseTime: 1200,
            conversationStarters: [
              'How do I improve my prompts?',
              'What makes a good AI prompt?',
            ],
          },
        },
      ]

      const mockInteractions: ProcessedAIInteraction[] = [
        {
          interactionId: '1',
          userId: uid,
          postId: '1',
          conversation: {
            userPrompt: 'How can I make my AI prompts more effective?',
            aiResponse:
              'Here are some key strategies for better prompt engineering...',
            context: {},
          },
          technical: {
            responseTime: 1100,
            modelUsed: 'claude-3',
            quality: {
              relevance: 0.92,
              helpfulness: 0.89,
              accuracy: 0.95,
            },
          },
          engagement: {
            userSatisfaction: 0.88,
            followUpQuestions: 2,
            sessionDuration: 450,
          },
          metadata: {
            timestamp: new Date(),
            deviceType: 'desktop',
            sessionId: 'session1',
          },
        },
      ]

      const mockFollowing: ProcessedUser[] = [
        {
          uid: 'user1',
          displayName: 'Alice Chen',
          bio: 'AI researcher and developer',
          avatar: { url: '', alt: 'Alice avatar' },
          isOfficial: true,
          isVerified: true,
          preferences: {
            theme: 'dark',
            language: 'en',
            device: 'desktop',
            notificationSettings: {},
          },
          stats: {
            posts: 45,
            followers: 1250,
            following: 180,
            engagementRate: 75,
          },
          social: {
            influenceLevel: 'expert',
            activityScore: 85,
            lastSeen: new Date(),
            connectionStrength: 0.8,
          },
          status: {
            isOnline: true,
            lastActive: new Date(),
            availability: 'available',
          },
        },
      ]

      setMockData({
        allPosts: mockPosts,
        userInteractions: mockInteractions,
        followingUsers: mockFollowing,
      })

      // Process user experience through DIKW pipeline
      try {
        const result = await processUserExperience(
          mockPosts,
          mockInteractions,
          mockFollowing,
          {
            sessionDuration: 600,
            device: 'desktop',
            timeOfDay: getTimeOfDay(),
          }
        )

        if (result?.processedUser) {
          // Get personalized content recommendations
          await getRecommendations(
            result.processedUser,
            mockPosts,
            mockInteractions,
            mockFollowing,
            {
              recommendationType: 'feed',
              maxResults: 10,
            }
          )
        }
      } catch (err) {
        console.error('DIKW processing error:', err)
      }
    }

    loadData()
  }, [uid, processUserExperience, getRecommendations])

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours()
    if (hour < 6) return 'night'
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    if (hour < 22) return 'evening'
    return 'night'
  }

  if (!uid) {
    return (
      <div className='p-4 text-gray-600'>
        Please log in to view personalized content.
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className='p-4'>
        <div className='animate-pulse space-y-4'>
          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
        </div>
        <p className='text-sm text-gray-600 mt-2'>
          Processing your personalized feed...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
        <h3 className='text-red-800 font-medium'>Error loading content</h3>
        <p className='text-red-600 text-sm mt-1'>{error.message}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* DIKW Intelligence Summary */}
      {lastUserExperience && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='text-blue-800 font-medium mb-2'>
            🧠 AI-Powered Insights
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div>
              <span className='font-medium text-blue-700'>User Profile:</span>
              <p className='text-blue-600'>
                Activity Score:{' '}
                {lastUserExperience.processedUser.social.activityScore}/100
              </p>
              <p className='text-blue-600'>
                Influence:{' '}
                {lastUserExperience.processedUser.social.influenceLevel}
              </p>
            </div>
            <div>
              <span className='font-medium text-blue-700'>
                Recommendations:
              </span>
              <p className='text-blue-600'>
                {lastUserExperience.recommendations?.posts?.length || 0}{' '}
                personalized posts
              </p>
            </div>
            <div>
              <span className='font-medium text-blue-700'>AI Strategy:</span>
              <p className='text-blue-600'>
                {lastUserExperience.strategicDecisions?.aiStrategy?.model ||
                  'standard'}{' '}
                mode
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Content */}
      {recommendations && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>📋 Recommended for You</h2>
          <div className='space-y-4'>
            {recommendations.posts
              ?.slice(0, 5)
              .map((scoredPost: any, _index: number) => (
                <div
                  key={scoredPost.post.postId}
                  className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <span className='font-medium text-gray-900'>
                          {scoredPost.post.author.displayName}
                        </span>
                        {scoredPost.post.author.isVerified && (
                          <span className='text-blue-500'>✓</span>
                        )}
                        <span className='text-sm text-gray-500'>•</span>
                        <span className='text-sm text-gray-500'>
                          {scoredPost.post.metadata.publishedAt.toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className='font-semibold text-lg text-gray-900 mb-2'>
                        {scoredPost.post.content.title}
                      </h3>

                      <p className='text-gray-600 mb-3'>
                        {scoredPost.post.content.description}
                      </p>

                      {/* AI Insights */}
                      <div className='flex items-center space-x-4 text-sm text-gray-500 mb-3'>
                        <span>📊 Score: {Math.round(scoredPost.score)}</span>
                        <span>
                          🎯 {scoredPost.post.engagement.engagementRate}%
                          engagement
                        </span>
                        <span>
                          ⭐ {scoredPost.post.quality.contentScore.toFixed(2)}{' '}
                          quality
                        </span>
                      </div>

                      {/* Recommendation Reasons */}
                      <div className='flex flex-wrap gap-2 mb-3'>
                        {scoredPost.reasons.map(
                          (reason: string, reasonIndex: number) => (
                            <span
                              key={reasonIndex}
                              className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'
                            >
                              {reason}
                            </span>
                          )
                        )}
                      </div>

                      {/* Tags */}
                      <div className='flex flex-wrap gap-2'>
                        {scoredPost.post.metadata.tags.map(
                          (tag: any, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className='bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded'
                            >
                              #{tag.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className='ml-4 text-center'>
                      <div className='text-2xl mb-2'>
                        {scoredPost.post.metadata.isTrending ? '🔥' : '📝'}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {scoredPost.algorithm.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      {mockData?.allPosts && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>📚 All Posts</h2>
          <div className='space-y-4'>
            {mockData.allPosts.map((post, _index) => (
              <div
                key={post.postId}
                className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'
              >
                <div className='flex items-center space-x-2 mb-2'>
                  <span className='font-medium text-gray-900'>
                    {post.author.displayName}
                  </span>
                  {post.author.isVerified && (
                    <span className='text-blue-500'>✓</span>
                  )}
                  {post.metadata.isTrending && (
                    <span className='text-orange-500'>🔥</span>
                  )}
                </div>

                <h3 className='font-semibold text-lg text-gray-900 mb-2'>
                  {post.content.title}
                </h3>
                <p className='text-gray-600 mb-3'>{post.content.description}</p>

                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <span>👥 {post.engagement.interactions} interactions</span>
                  <span>📈 {post.engagement.engagementRate}% engagement</span>
                  <span>⭐ {post.quality.contentScore.toFixed(2)} quality</span>
                  <span>🕒 {post.content.readingTime} min read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIKW Architecture Status */}
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm'>
        <h4 className='font-medium text-gray-800 mb-2'>
          🏗️ DIKW Architecture Status
        </h4>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
          <div>
            <span className='block font-medium text-gray-700'>Data Layer</span>
            <span className='text-green-600'>✓ Active</span>
          </div>
          <div>
            <span className='block font-medium text-gray-700'>
              Information Layer
            </span>
            <span className='text-green-600'>✓ Processing</span>
          </div>
          <div>
            <span className='block font-medium text-gray-700'>
              Knowledge Layer
            </span>
            <span className='text-green-600'>✓ Recommendations</span>
          </div>
          <div>
            <span className='block font-medium text-gray-700'>
              Wisdom Layer
            </span>
            <span className='text-green-600'>✓ Strategic Decisions</span>
          </div>
        </div>
      </div>

      {isLoadingRecommendations && (
        <div className='text-center text-gray-600 py-4'>
          <div className='animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full'></div>
          <span className='ml-2'>Loading intelligent recommendations...</span>
        </div>
      )}
    </div>
  )
}
