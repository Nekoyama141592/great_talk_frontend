import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Alert,
  Fade,
  Skeleton,
  Badge,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Timeline,
  Schedule,
  Comment,
  Visibility,
  Psychology,
  People,
  NotificationsActive,
} from '@mui/icons-material'
import { useTimelinePosts } from '@features/posts/hooks/use-timeline-posts'
import { useRealtimeTimeline } from '@features/posts/hooks/use-realtime-timeline'
import { LikeButton } from '../like-button'
import { FollowButton } from '@users/components/follow-button'

export const EnhancedTimelineComponent = () => {
  const [useRealtime, setUseRealtime] = useState(false)

  // Regular timeline with pagination
  const {
    data: paginatedData,
    isPending: isPaginatedPending,
    error: paginatedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTimelinePosts()

  // Real-time timeline
  const {
    posts: realtimePosts,
    loading: realtimeLoading,
    error: realtimeError,
    markAsRead,
    hasNewPosts,
    unreadCount,
  } = useRealtimeTimeline()

  // Choose data source based on user preference
  const posts = useRealtime
    ? realtimePosts
    : paginatedData?.pages.flatMap(page => page.posts) || []
  const loading = useRealtime ? realtimeLoading : isPaginatedPending
  const error = useRealtime ? realtimeError : paginatedError?.message

  const handlePostClick = (postId: string) => {
    if (useRealtime) {
      markAsRead(postId)
    }
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        エラーが発生しました: {error}
      </Alert>
    )
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        <TimelineSkeleton />
      </Box>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <Alert severity='info' sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <People sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography>フォローしているユーザーの投稿がありません</Typography>
          <Typography variant='body2' color='text.secondary'>
            ユーザーをフォローして、タイムラインに投稿を表示しましょう
          </Typography>
        </Box>
      </Alert>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* Enhanced Timeline Header */}
      <Card
        sx={{ mb: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}
      >
        <CardContent sx={{ py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge
                badgeContent={useRealtime ? unreadCount : 0}
                color='secondary'
              >
                <Timeline />
              </Badge>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                タイムライン
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {useRealtime && hasNewPosts && (
                <Tooltip title='新しい投稿があります'>
                  <IconButton
                    color='inherit'
                    size='small'
                    sx={{ animation: 'pulse 1.5s infinite' }}
                  >
                    <NotificationsActive />
                  </IconButton>
                </Tooltip>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={useRealtime}
                    onChange={e => setUseRealtime(e.target.checked)}
                    size='small'
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                }
                label={
                  <Typography
                    variant='caption'
                    sx={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    リアルタイム
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Box>
          </Box>

          <Typography variant='body2' sx={{ opacity: 0.9, mt: 0.5 }}>
            {useRealtime
              ? `リアルタイム更新中${unreadCount > 0 ? ` (${unreadCount}件の未読)` : ''}`
              : 'フォローしているユーザーの最新投稿'}
          </Typography>
        </CardContent>
      </Card>

      {/* Timeline Posts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post, index) => (
          <Fade key={post.postId} in={true} timeout={300 + index * 100}>
            <Card
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                border: '1px solid',
                borderColor:
                  useRealtime && !(post as Record<string, unknown>).isRead
                    ? 'primary.main'
                    : 'divider',
                bgcolor:
                  useRealtime && !(post as Record<string, unknown>).isRead
                    ? 'primary.50'
                    : 'background.paper',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Link
                  to={`/users/${post.uid}/posts/${post.postId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={() => handlePostClick(post.postId)}
                >
                  {/* Timeline Post Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <Psychology />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {post.title.value}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Schedule fontSize='inherit' />
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {useRealtime &&
                        !(post as Record<string, unknown>).isRead && (
                          <Chip
                            label='新着'
                            size='small'
                            color='primary'
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      <FollowButton
                        targetUserId={post.uid}
                        isFollowing={true}
                        size='small'
                        variant='outlined'
                      />
                    </Box>
                  </Box>

                  {/* Post Content */}
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      mb: 2,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.description.value}
                  </Typography>

                  {/* Sentiment & Moderation Indicators */}
                  <Box
                    sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}
                  >
                    {post.title.sentiment && (
                      <Chip
                        label={
                          post.title.sentiment === 'POSITIVE'
                            ? 'ポジティブ'
                            : post.title.sentiment === 'NEGATIVE'
                              ? 'ネガティブ'
                              : 'ニュートラル'
                        }
                        size='small'
                        color={
                          post.title.sentiment === 'POSITIVE'
                            ? 'success'
                            : post.title.sentiment === 'NEGATIVE'
                              ? 'error'
                              : 'default'
                        }
                        variant='outlined'
                      />
                    )}
                    {post.customCompleteText?.systemPrompt && (
                      <Chip
                        label='AI対話可能'
                        size='small'
                        color='primary'
                        variant='outlined'
                        icon={<Psychology />}
                      />
                    )}
                  </Box>

                  {/* Post Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f0f0f0',
                      pt: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Comment fontSize='small' color='action' />
                        <Typography variant='body2' color='text.secondary'>
                          {post.msgCount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Visibility fontSize='small' color='action' />
                        <Typography variant='body2' color='text.secondary'>
                          {(post as Record<string, unknown>).impressionCount ||
                            0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box onClick={e => e.preventDefault()}>
                      <LikeButton
                        postId={post.postId}
                        targetUserId={post.uid}
                        likeCount={post.likeCount}
                        size='medium'
                        showCount={false}
                      />
                    </Box>
                  </Box>
                </Link>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Load More for Paginated Mode */}
      {!useRealtime && hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
              opacity: isFetchingNextPage ? 0.6 : 1,
            }}
          >
            {isFetchingNextPage ? '読み込み中...' : 'さらに読み込む'}
          </button>
        </Box>
      )}
    </Box>
  )
}

// Helper component for loading skeleton
const TimelineSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card sx={{ borderRadius: 2, bgcolor: 'primary.main' }}>
        <CardContent sx={{ py: 2 }}>
          <Skeleton
            variant='text'
            width='40%'
            height={28}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
          />
          <Skeleton
            variant='text'
            width='60%'
            height={16}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
          />
        </CardContent>
      </Card>

      {[1, 2, 3].map(i => (
        <Card
          key={i}
          sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton
                variant='circular'
                width={40}
                height={40}
                sx={{ mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant='text' width='60%' height={24} />
                <Skeleton variant='text' width='40%' height={16} />
              </Box>
              <Skeleton variant='rectangular' width={80} height={24} />
            </Box>
            <Skeleton variant='text' width='100%' height={20} />
            <Skeleton variant='text' width='80%' height={20} />
            <Skeleton variant='text' width='90%' height={20} />
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Skeleton variant='text' width='30%' height={20} />
              <Skeleton variant='text' width='20%' height={20} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

// Helper function to format date
const formatDate = (timestamp: any) => {
  if (!timestamp) return ''

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    if (days < 7) return `${days}日前`

    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}
