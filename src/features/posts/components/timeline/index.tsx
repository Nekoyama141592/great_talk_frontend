import { useEffect, useRef } from 'react'
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
  CircularProgress,
} from '@mui/material'
import {
  Timeline,
  Schedule,
  Comment,
  Visibility,
  Psychology,
  People,
} from '@mui/icons-material'
import { PublicPost } from '@shared/schema/public-post'
import { useTimelinePosts } from '@features/posts/hooks/use-timeline-posts'
import { LikeButton } from '../like-button'

export const TimelineComponent = () => {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTimelinePosts()

  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (error) {
    return (
      <Alert severity='error' sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        エラーが発生しました: {error.message}
      </Alert>
    )
  }

  if (isPending) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        <TimelineSkeleton />
      </Box>
    )
  }

  if (!data || data.pages.length === 0) {
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

  const posts: PublicPost[] = data.pages.flatMap(page => page.posts)

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* Timeline Header */}
      <Card
        sx={{ mb: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline />
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              タイムライン
            </Typography>
          </Box>
          <Typography variant='body2' sx={{ opacity: 0.9, mt: 0.5 }}>
            フォローしているユーザーの最新投稿
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
                borderColor: 'primary.main',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                  borderColor: 'primary.dark',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Link
                  to={`/users/${post.uid}/posts/${post.postId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
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
                    <Chip
                      label='フォロー中'
                      size='small'
                      color='primary'
                      variant='outlined'
                    />
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
                        showCount={true}
                      />
                    </Box>
                  </Box>
                </Link>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Infinite Scroll Loading Indicator */}
      <Box
        ref={loadMoreRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          minHeight: 60,
        }}
      >
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={24} />
            <Typography variant='body2' color='text.secondary'>
              読み込み中...
            </Typography>
          </Box>
        )}
        {!hasNextPage && posts.length > 0 && (
          <Typography variant='body2' color='text.secondary'>
            すべての投稿を表示しました
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// Helper component for loading skeleton
const TimelineSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map(i => (
        <Card
          key={i}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
          }}
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
              <Skeleton variant='rectangular' width={60} height={20} />
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
