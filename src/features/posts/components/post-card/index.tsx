import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Fade,
} from '@mui/material'
import {
  Schedule,
  Comment,
  Visibility,
  Psychology,
  People,
} from '@mui/icons-material'
import { PublicPost } from '@shared/schema/public-post'
import { useIsPostMuted } from '../../hooks/use-post-mute'
import { LikeButton } from '../like-button'
import { PostMenu } from '../post-menu'
import { MutedPostCard } from '../muted-post-card'

export interface PostCardProps {
  post: PublicPost
  index?: number
  isFollowingView?: boolean
  onShare?: (post: PublicPost) => void
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  index = 0,
  isFollowingView = false,
  onShare,
}) => {
  const isMuted = useIsPostMuted(post.postId)

  // ミュートされた投稿の場合は専用カードを表示
  if (isMuted) {
    return (
      <Fade in={true} timeout={300 + index * 100}>
        <div>
          <MutedPostCard post={post} />
        </div>
      </Fade>
    )
  }

  // 通常の投稿カード
  return (
    <Fade in={true} timeout={300 + index * 100}>
      <Card
        sx={{
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          border: isFollowingView ? '1px solid' : 'none',
          borderColor: isFollowingView ? 'primary.main' : 'transparent',
          bgcolor: isFollowingView ? 'primary.50' : 'background.paper',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: isFollowingView ? 'primary.dark' : 'transparent',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Link
            to={`/users/${post.uid}/posts/${post.postId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {/* Post Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  bgcolor: '#10b981',
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

              {/* フォロー中表示の場合はフォローチップを表示 */}
              {isFollowingView && (
                <Chip
                  label='フォロー中'
                  size='small'
                  color='primary'
                  variant='outlined'
                  icon={<People />}
                />
              )}

              {/* 投稿メニュー */}
              <Box onClick={e => e.preventDefault()}>
                <PostMenu
                  postId={post.postId}
                  postUid={post.uid}
                  postTitle={post.title.value}
                  onShare={() => onShare?.(post)}
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
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Comment fontSize='small' color='action' />
                  <Typography variant='body2' color='text.secondary'>
                    {post.msgCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility fontSize='small' color='action' />
                  <Typography variant='body2' color='text.secondary'>
                    {(post as Record<string, unknown>).impressionCount || 0}
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

export default PostCard
