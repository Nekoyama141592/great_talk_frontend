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
  Tooltip,
} from '@mui/material'
import {
  Schedule,
  Comment,
  Visibility,
  Psychology,
  People,
  AutoAwesome,
} from '@mui/icons-material'
// import { colors, glassMorphism, hoverScale } from '@shared/theme/modern-theme'
import { PublicPost } from '@shared/schema/public-post'
import { useIsPostMuted } from '../../hooks/use-post-mute'
import { LikeButton } from '../like-button'
import { PostMenu } from '../post-menu'
import { MutedPostCard } from '../muted-post-card'
import { getUserImageUrl, getPostImageUrl } from '@/utils/image_url_util'

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
  console.log(getPostImageUrl(post.uid, post.postId))
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
          borderRadius: 3,
          background: isFollowingView
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: isFollowingView
            ? '2px solid rgba(34, 197, 94, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: isFollowingView ? '4px' : '2px',
            background: isFollowingView
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            opacity: isFollowingView ? 1 : 0.6,
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            background: isFollowingView
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.04) 100%)'
              : 'rgba(255, 255, 255, 0.95)',
            border: isFollowingView
              ? '2px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(34, 197, 94, 0.2)',
            '&:before': {
              height: '4px',
              opacity: 1,
            },
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Link
            to={`/users/${post.uid}/posts/${post.postId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {/* Post Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={getUserImageUrl(post.uid)}
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  background:
                    'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: '0 12px 24px rgba(34, 197, 94, 0.4)',
                  },
                }}
              >
                <Psychology sx={{ fontSize: 24 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    lineHeight: 1.3,
                    mb: 1,
                    background:
                      'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {post.title.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<Schedule sx={{ fontSize: 14 }} />}
                    label={formatDate(post.createdAt)}
                    size='small'
                    sx={{
                      background: 'rgba(148, 163, 184, 0.1)',
                      color: 'text.secondary',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      '&:hover': {
                        background: 'rgba(148, 163, 184, 0.2)',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* フォロー中表示の場合はフォローチップを表示 */}
              {isFollowingView && (
                <Chip
                  label='フォロー中'
                  size='medium'
                  icon={<People sx={{ fontSize: 16 }} />}
                  sx={{
                    background:
                      'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                    },
                  }}
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
              variant='body1'
              sx={{
                mb: 3,
                lineHeight: 1.7,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {post.description.value}
            </Typography>

            {/* Post Image */}
            {post.image?.value && (
              <Box
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <img
                  src={getPostImageUrl(post.uid, post.postId)}
                  alt={post.title.value}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </Box>
            )}

            {/* Sentiment & Moderation Indicators */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              {post.title.sentiment && (
                <Chip
                  label={
                    post.title.sentiment === 'POSITIVE'
                      ? '✨ ポジティブ'
                      : post.title.sentiment === 'NEGATIVE'
                        ? '🤔 ネガティブ'
                        : '😐 ニュートラル'
                  }
                  size='small'
                  sx={{
                    background:
                      post.title.sentiment === 'POSITIVE'
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : post.title.sentiment === 'NEGATIVE'
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                />
              )}
              {post.customCompleteText?.systemPrompt && (
                <Chip
                  label='AI対話可能'
                  size='small'
                  icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                  sx={{
                    background:
                      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.8 },
                    },
                  }}
                />
              )}
            </Box>

            {/* Post Stats */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.4) 100%)',
                borderRadius: 2,
                p: 2,
                mt: 2,
                border: '1px solid rgba(226, 232, 240, 0.5)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Tooltip title='コメント数' arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Comment sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {post.msgCount}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title='閲覧数' arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        color: 'info.main',
                      },
                    }}
                  >
                    <Visibility
                      sx={{ fontSize: 18, color: 'text.secondary' }}
                    />
                  </Box>
                </Tooltip>
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
