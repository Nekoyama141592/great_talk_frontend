import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Alert,
  Skeleton,
  CircularProgress,
} from '@mui/material'
import { TrendingUp, Schedule, People } from '@mui/icons-material'
import { PublicPost } from '@shared/schema/public-post'
import { usePosts, PostSortType } from '@features/posts/hooks/use-posts'
import { useTimelinePosts } from '@features/posts/hooks/use-timeline-posts'
import { usePostMute } from '../../hooks/use-post-mute'
import { useUserMute } from '@users/hooks/use-user-mute'
import { PostCard } from '../post-card'

type ViewType = 'popularity' | 'newest' | 'following'

export const PostsComponent = () => {
  const [viewType, setViewType] = useState<ViewType>('popularity')
  const { initializeMuteTokens } = usePostMute()
  const { initializeMuteTokens: initializeUserMuteTokens } = useUserMute()

  // 通常の投稿データ（フォロー中の場合は人気順にフォールバック）
  const sortType = (
    viewType === 'following' ? 'popularity' : viewType
  ) as PostSortType
  const {
    data: postsData,
    isPending: isPostsPending,
    error: postsError,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
  } = usePosts(sortType)

  // フォロー中の投稿データ（フォロー中タブが選択されている場合のみ有効）
  const {
    data: timelineData,
    isPending: isTimelinePending,
    error: timelineError,
    fetchNextPage: fetchNextTimelinePage,
    hasNextPage: hasNextTimelinePage,
    isFetchingNextPage: isFetchingNextTimelinePage,
  } = useTimelinePosts(viewType === 'following')

  // 現在選択されたビューに応じてデータを選択
  const isFollowingView = viewType === 'following'
  const data = isFollowingView ? timelineData : postsData
  const isPending = isFollowingView ? isTimelinePending : isPostsPending
  const error = isFollowingView ? timelineError : postsError
  const fetchNextPage = isFollowingView
    ? fetchNextTimelinePage
    : fetchNextPostsPage
  const hasNextPage = isFollowingView ? hasNextTimelinePage : hasNextPostsPage
  const isFetchingNextPage = isFollowingView
    ? isFetchingNextTimelinePage
    : isFetchingNextPostsPage

  const loadMoreRef = useRef<HTMLDivElement>(null)

  // ミュートトークンを初期化（一度だけ実行、リトライなし）
  useEffect(() => {
    initializeMuteTokens()
    initializeUserMuteTokens()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        <PostsSkeleton />
      </Box>
    )
  }

  if (
    !data ||
    data.pages.length === 0 ||
    data.pages.every(page => page.posts.length === 0)
  ) {
    if (isFollowingView) {
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
      <Alert severity='info' sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        投稿がありません
      </Alert>
    )
  }

  const posts: PublicPost[] = data.pages.flatMap(page => page.posts)

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      {/* Modern View Controls */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(226, 232, 240, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '-0.025em',
            }}
          >
            📊 投稿を探す
          </Typography>
          <ButtonGroup
            variant='outlined'
            size='large'
            sx={{
              width: '100%',
              '& .MuiButton-root': {
                flex: 1,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '12px 24px',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  transition: 'left 0.5s ease',
                },
                '&:hover:before': {
                  left: '100%',
                },
              },
            }}
          >
            <Button
              onClick={() => setViewType('popularity')}
              variant={viewType === 'popularity' ? 'contained' : 'outlined'}
              startIcon={<TrendingUp />}
              sx={{
                background:
                  viewType === 'popularity'
                    ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                    : 'transparent',
                borderColor: '#f97316',
                color: viewType === 'popularity' ? 'white' : '#f97316',
                boxShadow:
                  viewType === 'popularity'
                    ? '0 8px 24px rgba(249, 115, 22, 0.3)'
                    : 'none',
                '&:hover': {
                  background:
                    viewType === 'popularity'
                      ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
                      : 'rgba(249, 115, 22, 0.1)',
                  borderColor: '#ea580c',
                  transform: 'translateY(-2px)',
                  boxShadow:
                    viewType === 'popularity'
                      ? '0 12px 32px rgba(249, 115, 22, 0.4)'
                      : '0 4px 16px rgba(249, 115, 22, 0.2)',
                },
              }}
            >
              🔥 人気順
            </Button>
            <Button
              onClick={() => setViewType('newest')}
              variant={viewType === 'newest' ? 'contained' : 'outlined'}
              startIcon={<Schedule />}
              sx={{
                background:
                  viewType === 'newest'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : 'transparent',
                borderColor: '#3b82f6',
                color: viewType === 'newest' ? 'white' : '#3b82f6',
                boxShadow:
                  viewType === 'newest'
                    ? '0 8px 24px rgba(59, 130, 246, 0.3)'
                    : 'none',
                '&:hover': {
                  background:
                    viewType === 'newest'
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : 'rgba(59, 130, 246, 0.1)',
                  borderColor: '#2563eb',
                  transform: 'translateY(-2px)',
                  boxShadow:
                    viewType === 'newest'
                      ? '0 12px 32px rgba(59, 130, 246, 0.4)'
                      : '0 4px 16px rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              ⚡ 新着順
            </Button>
            <Button
              onClick={() => setViewType('following')}
              variant={viewType === 'following' ? 'contained' : 'outlined'}
              startIcon={<People />}
              sx={{
                background:
                  viewType === 'following'
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : 'transparent',
                borderColor: '#22c55e',
                color: viewType === 'following' ? 'white' : '#22c55e',
                boxShadow:
                  viewType === 'following'
                    ? '0 8px 24px rgba(34, 197, 94, 0.3)'
                    : 'none',
                '&:hover': {
                  background:
                    viewType === 'following'
                      ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                      : 'rgba(34, 197, 94, 0.1)',
                  borderColor: '#16a34a',
                  transform: 'translateY(-2px)',
                  boxShadow:
                    viewType === 'following'
                      ? '0 12px 32px rgba(34, 197, 94, 0.4)'
                      : '0 4px 16px rgba(34, 197, 94, 0.2)',
                },
              }}
            >
              👥 フォロー中
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      {/* Enhanced Posts List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '& > *': {
            animation: 'fadeInUp 0.6s ease-out',
            animationFillMode: 'both',
          },
          '& > *:nth-of-type(1)': { animationDelay: '0.1s' },
          '& > *:nth-of-type(2)': { animationDelay: '0.2s' },
          '& > *:nth-of-type(3)': { animationDelay: '0.3s' },
          '& > *:nth-of-type(4)': { animationDelay: '0.4s' },
          '& > *:nth-of-type(5)': { animationDelay: '0.5s' },
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(30px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {posts.map((post, index) => (
          <PostCard
            key={post.postId}
            post={post}
            index={index}
            isFollowingView={isFollowingView}
            onShare={post => {
              navigator.share?.({
                title: post.title.value,
                text: post.description.value,
                url:
                  window.location.origin +
                  `/users/${post.uid}/posts/${post.postId}`,
              })
            }}
          />
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
const PostsSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map(i => (
        <Card key={i} sx={{ borderRadius: 2 }}>
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
