/**
 * EXAMPLE COMPONENT - Admin Dashboard using DIKW Architecture
 * Demonstrates strategic insights and system-wide intelligence
 */

import React, { useEffect, useState } from 'react'
import {
  useStrategicInsights,
  useDIKWPerformance,
  useBusinessRules,
} from '../../layers/integration/hooks/use-dikw'
import {
  ProcessedUser,
  ProcessedPost,
  ProcessedAIInteraction,
} from '../../layers/information/models/processed-data'

interface AdminDashboardExampleProps {
  className?: string
}

export const AdminDashboardExample = ({
  className,
}: AdminDashboardExampleProps) => {
  const {
    strategicDecisions,
    aiAdvice,
    isLoadingInsights,
    getStrategicDecisions,
    getAIAdvice,
  } = useStrategicInsights({
    enableWisdomLayer: true,
    cacheStrategy: 'memory',
  })

  const { performanceMetrics, measurePerformance } = useDIKWPerformance()

  const { moderationResults, checkContentModeration } = useBusinessRules()

  const [systemData, setSystemData] = useState<{
    users: ProcessedUser[]
    posts: ProcessedPost[]
    interactions: ProcessedAIInteraction[]
  } | null>(null)

  // Removed unused insights state

  // Load system data and generate insights
  useEffect(() => {
    const loadSystemData = async () => {
      // Mock system data - in real app, this would come from your analytics APIs
      const mockUsers: ProcessedUser[] = [
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
            engagementRate: 85,
          },
          social: {
            influenceLevel: 'expert',
            activityScore: 92,
            lastSeen: new Date(),
            connectionStrength: 0.9,
          },
          status: {
            isOnline: true,
            lastActive: new Date(),
            availability: 'available',
          },
        },
        {
          uid: 'user2',
          displayName: 'Bob Johnson',
          bio: 'Content creator and educator',
          avatar: { url: '', alt: 'Bob avatar' },
          isOfficial: false,
          isVerified: true,
          preferences: {
            theme: 'light',
            language: 'en',
            device: 'mobile',
            notificationSettings: {},
          },
          stats: {
            posts: 23,
            followers: 450,
            following: 89,
            engagementRate: 67,
          },
          social: {
            influenceLevel: 'regular',
            activityScore: 73,
            lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
            connectionStrength: 0.6,
          },
          status: {
            isOnline: false,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            availability: 'away',
          },
        },
      ]

      const mockPosts: ProcessedPost[] = [
        {
          postId: '1',
          author: mockUsers[0],
          content: {
            title: 'The Future of AI in Education',
            description:
              'Exploring how artificial intelligence will transform learning.',
            body: 'AI is revolutionizing education in unprecedented ways...',
            language: 'en',
            readingTime: 12,
          },
          metadata: {
            postType: 'article',
            categories: ['AI', 'Education', 'Technology'],
            tags: [
              { name: 'artificial-intelligence', category: 'technology' },
              { name: 'education', category: 'topic' },
              { name: 'future-trends', category: 'analysis' },
            ],
            publishedAt: new Date(),
            isPublic: true,
            isTrending: true,
            source: 'web',
          },
          engagement: {
            interactions: 245,
            engagementRate: 78,
            trendingScore: 95,
            socialShares: 67,
          },
          quality: {
            contentScore: 0.92,
            moderationFlags: [],
            readabilityScore: 0.85,
            credibilityScore: 0.94,
          },
          ai: {
            systemPrompt: 'You are an expert in educational technology...',
            responseCount: 56,
            averageResponseTime: 1400,
            conversationStarters: [
              'How will AI change learning?',
              'What are the benefits?',
            ],
          },
        },
        {
          postId: '2',
          author: mockUsers[1],
          content: {
            title: 'Quick AI Tips for Beginners',
            description: 'Simple strategies to get started with AI tools.',
            body: 'Here are some easy ways to begin using AI in your daily work...',
            language: 'en',
            readingTime: 5,
          },
          metadata: {
            postType: 'tutorial',
            categories: ['AI', 'Beginner', 'Tips'],
            tags: [
              { name: 'beginner-friendly', category: 'difficulty' },
              { name: 'quick-tips', category: 'format' },
            ],
            publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            isPublic: true,
            isTrending: false,
            source: 'mobile',
          },
          engagement: {
            interactions: 89,
            engagementRate: 45,
            trendingScore: 32,
            socialShares: 12,
          },
          quality: {
            contentScore: 0.68,
            moderationFlags: [],
            readabilityScore: 0.92,
            credibilityScore: 0.71,
          },
          ai: {
            systemPrompt: 'You are a helpful AI assistant for beginners...',
            responseCount: 23,
            averageResponseTime: 950,
            conversationStarters: ['What is AI?', 'How do I start?'],
          },
        },
      ]

      const mockInteractions: ProcessedAIInteraction[] = [
        {
          interactionId: '1',
          userId: 'user1',
          postId: '1',
          conversation: {
            userPrompt: 'How will AI personalization work in classrooms?',
            aiResponse:
              "AI personalization in classrooms will adapt to each student's learning style...",
            context: { subject: 'education' },
          },
          technical: {
            responseTime: 1200,
            modelUsed: 'claude-3',
            quality: {
              relevance: 0.95,
              helpfulness: 0.91,
              accuracy: 0.96,
            },
          },
          engagement: {
            userSatisfaction: 0.93,
            followUpQuestions: 3,
            sessionDuration: 720,
          },
          metadata: {
            timestamp: new Date(),
            deviceType: 'desktop',
            sessionId: 'session1',
          },
        },
      ]

      setSystemData({
        users: mockUsers,
        posts: mockPosts,
        interactions: mockInteractions,
      })

      // Generate strategic insights
      await measurePerformance(async () => {
        return await getStrategicDecisions(
          mockUsers,
          mockPosts,
          mockInteractions
        )
      })

      // Get AI advisory insights
      await getAIAdvice('business_strategy', {
        currentMetrics: {
          user_growth: 0.15,
          engagement_rate: 0.72,
          content_quality: 0.84,
          ai_satisfaction: 0.88,
        },
        businessGoals: ['growth', 'engagement', 'quality'],
        constraints: ['performance', 'moderation'],
        stakeholderPriorities: {
          user_experience: 0.9,
          business_growth: 0.8,
          technical_performance: 0.7,
        },
      })

      // Strategic insights processed and advisory generated
    }

    loadSystemData()
  }, [getStrategicDecisions, getAIAdvice, measurePerformance])

  // Test content moderation
  const testModeration = () => {
    if (systemData?.posts[0]) {
      checkContentModeration(systemData.posts[0])
    }
  }

  if (isLoadingInsights) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='h-32 bg-gray-200 rounded'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </div>
        <p className='text-sm text-gray-600 mt-4'>
          Analyzing system intelligence...
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='border-b border-gray-200 pb-4'>
        <h1 className='text-2xl font-bold text-gray-900'>
          🎯 Strategic Intelligence Dashboard
        </h1>
        <p className='text-gray-600 mt-1'>
          DIKW Architecture - System-wide insights and decision support
        </p>
      </div>

      {/* Performance Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-500'>Data Layer</h3>
          <p className='text-2xl font-bold text-blue-600'>
            {performanceMetrics.dataLayerTime.toFixed(0)}ms
          </p>
          <p className='text-xs text-gray-500'>Processing time</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-500'>
            Information Layer
          </h3>
          <p className='text-2xl font-bold text-green-600'>
            {performanceMetrics.informationLayerTime.toFixed(0)}ms
          </p>
          <p className='text-xs text-gray-500'>Aggregation time</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-500'>Knowledge Layer</h3>
          <p className='text-2xl font-bold text-purple-600'>
            {performanceMetrics.knowledgeLayerTime.toFixed(0)}ms
          </p>
          <p className='text-xs text-gray-500'>Analysis time</p>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-500'>Wisdom Layer</h3>
          <p className='text-2xl font-bold text-orange-600'>
            {performanceMetrics.wisdomLayerTime.toFixed(0)}ms
          </p>
          <p className='text-xs text-gray-500'>Decision time</p>
        </div>
      </div>

      {/* System Overview */}
      {systemData && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              👥 User Analytics
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Users:</span>
                <span className='font-medium'>{systemData.users.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Online:</span>
                <span className='font-medium text-green-600'>
                  {systemData.users.filter(u => u.status.isOnline).length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Activity:</span>
                <span className='font-medium'>
                  {Math.round(
                    systemData.users.reduce(
                      (sum, u) => sum + u.social.activityScore,
                      0
                    ) / systemData.users.length
                  )}
                  /100
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Experts:</span>
                <span className='font-medium text-blue-600'>
                  {
                    systemData.users.filter(
                      u => u.social.influenceLevel === 'expert'
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              📝 Content Analytics
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Posts:</span>
                <span className='font-medium'>{systemData.posts.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Trending:</span>
                <span className='font-medium text-orange-600'>
                  {systemData.posts.filter(p => p.metadata.isTrending).length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Quality:</span>
                <span className='font-medium'>
                  {(
                    systemData.posts.reduce(
                      (sum, p) => sum + p.quality.contentScore,
                      0
                    ) / systemData.posts.length
                  ).toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Engagement:</span>
                <span className='font-medium text-green-600'>
                  {Math.round(
                    systemData.posts.reduce(
                      (sum, p) => sum + p.engagement.engagementRate,
                      0
                    ) / systemData.posts.length
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              🤖 AI Analytics
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Interactions:</span>
                <span className='font-medium'>
                  {systemData.interactions.length}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Avg Response:</span>
                <span className='font-medium'>
                  {Math.round(
                    systemData.interactions.reduce(
                      (sum, i) => sum + i.technical.responseTime,
                      0
                    ) / systemData.interactions.length
                  )}
                  ms
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Satisfaction:</span>
                <span className='font-medium text-green-600'>
                  {Math.round(
                    (systemData.interactions.reduce(
                      (sum, i) => sum + i.engagement.userSatisfaction,
                      0
                    ) /
                      systemData.interactions.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Quality Score:</span>
                <span className='font-medium'>
                  {(
                    systemData.interactions.reduce(
                      (sum, i) => sum + i.technical.quality.relevance,
                      0
                    ) / systemData.interactions.length
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategic Decisions */}
      {strategicDecisions && strategicDecisions.length > 0 && (
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            🎯 Strategic Recommendations
          </h3>
          <div className='space-y-4'>
            {strategicDecisions
              .slice(0, 3)
              .map((decision: any, _index: number) => (
                <div
                  key={decision.id}
                  className='border border-gray-100 rounded-lg p-4'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-gray-900'>
                      {decision.description}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        decision.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : decision.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : decision.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {decision.priority} priority
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>
                    {decision.expectedOutcome}
                  </p>
                  <div className='flex items-center space-x-4 text-xs text-gray-500'>
                    <span>
                      📊 Confidence: {Math.round(decision.confidence * 100)}%
                    </span>
                    <span>📈 Type: {decision.type.replace('_', ' ')}</span>
                    <span>⏰ {decision.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Advisory */}
      {aiAdvice && (
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            🧠 AI Strategic Advisory
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-gray-900 mb-2'>
                Key Recommendations
              </h4>
              <div className='space-y-2'>
                {aiAdvice.recommendations
                  ?.slice(0, 3)
                  .map((rec: any, _index: number) => (
                    <div
                      key={_index}
                      className='text-sm p-2 bg-blue-50 rounded'
                    >
                      <span className='font-medium text-blue-900'>
                        {rec.title}
                      </span>
                      <p className='text-blue-700 text-xs mt-1'>
                        {rec.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h4 className='font-medium text-gray-900 mb-2'>
                System Insights
              </h4>
              <div className='space-y-2'>
                {aiAdvice.insights
                  ?.slice(0, 3)
                  .map((insight: any, _index: number) => (
                    <div
                      key={_index}
                      className='text-sm p-2 bg-green-50 rounded'
                    >
                      <span className='font-medium text-green-900'>
                        {insight.title}
                      </span>
                      <p className='text-green-700 text-xs mt-1'>
                        {insight.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Rules Testing */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          ⚖️ Business Rules & Moderation
        </h3>
        <div className='space-y-4'>
          <button
            onClick={testModeration}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Test Content Moderation
          </button>

          {moderationResults && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h4 className='font-medium text-gray-900 mb-2'>
                Moderation Results
              </h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-medium'>Status:</span>
                  <span
                    className={`ml-2 ${moderationResults.isApproved ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {moderationResults.isApproved ? '✓ Approved' : '✗ Flagged'}
                  </span>
                </div>
                <div>
                  <span className='font-medium'>Confidence:</span>
                  <span className='ml-2'>
                    {Math.round(moderationResults.confidence * 100)}%
                  </span>
                </div>
              </div>
              {moderationResults.flags &&
                moderationResults.flags.length > 0 && (
                  <div className='mt-2'>
                    <span className='font-medium text-sm'>Flags:</span>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {moderationResults.flags.map(
                        (flag: string, _index: number) => (
                          <span
                            key={_index}
                            className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded'
                          >
                            {flag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Architecture Status */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          🏗️ DIKW Architecture Status
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-sm'>
          <div className='text-center'>
            <div className='text-2xl mb-2'>📊</div>
            <div className='font-medium text-blue-700'>Data Layer</div>
            <div className='text-green-600 text-xs'>✓ Raw data validated</div>
            <div className='text-green-600 text-xs'>✓ Repository active</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-2'>🔄</div>
            <div className='font-medium text-green-700'>Information Layer</div>
            <div className='text-green-600 text-xs'>✓ Data processed</div>
            <div className='text-green-600 text-xs'>✓ Aggregation complete</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-2'>🧠</div>
            <div className='font-medium text-purple-700'>Knowledge Layer</div>
            <div className='text-green-600 text-xs'>✓ Rules executed</div>
            <div className='text-green-600 text-xs'>
              ✓ Recommendations ready
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-2'>🎯</div>
            <div className='font-medium text-orange-700'>Wisdom Layer</div>
            <div className='text-green-600 text-xs'>✓ Strategic decisions</div>
            <div className='text-green-600 text-xs'>✓ AI advisory active</div>
          </div>
        </div>
        <div className='mt-4 text-center text-sm text-gray-600'>
          Total processing time: {performanceMetrics.totalTime.toFixed(0)}ms
        </div>
      </div>
    </div>
  )
}
