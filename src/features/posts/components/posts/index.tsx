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
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* Enhanced View Controls */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <ButtonGroup
            variant='outlined'
            size='small'
            sx={{
              width: '100%',
              '& .MuiButton-root': {
                flex: 1,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Button
              onClick={() => setViewType('popularity')}
              variant={viewType === 'popularity' ? 'contained' : 'outlined'}
              startIcon={<TrendingUp />}
              sx={{
                backgroundColor:
                  viewType === 'popularity' ? '#10b981' : 'transparent',
                borderColor: '#10b981',
                color: viewType === 'popularity' ? 'white' : '#10b981',
                '&:hover': {
                  backgroundColor:
                    viewType === 'popularity' ? '#059669' : '#f0fdf4',
                  borderColor: '#10b981',
                },
              }}
            >
              人気順
            </Button>
            <Button
              onClick={() => setViewType('newest')}
              variant={viewType === 'newest' ? 'contained' : 'outlined'}
              startIcon={<Schedule />}
              sx={{
                backgroundColor:
                  viewType === 'newest' ? '#10b981' : 'transparent',
                borderColor: '#10b981',
                color: viewType === 'newest' ? 'white' : '#10b981',
                '&:hover': {
                  backgroundColor:
                    viewType === 'newest' ? '#059669' : '#f0fdf4',
                  borderColor: '#10b981',
                },
              }}
            >
              新着順
            </Button>
            <Button
              onClick={() => setViewType('following')}
              variant={viewType === 'following' ? 'contained' : 'outlined'}
              startIcon={<People />}
              sx={{
                backgroundColor:
                  viewType === 'following' ? '#10b981' : 'transparent',
                borderColor: '#10b981',
                color: viewType === 'following' ? 'white' : '#10b981',
                '&:hover': {
                  backgroundColor:
                    viewType === 'following' ? '#059669' : '#f0fdf4',
                  borderColor: '#10b981',
                },
              }}
            >
              フォロー中
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      {/* Enhanced Posts List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
