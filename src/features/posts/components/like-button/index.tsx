import React from 'react'
import { IconButton, Typography, Box, CircularProgress } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { usePostLike } from '../../hooks/use-post-like'
import { authAtom } from '@auth/atoms'
import { postLikeStateAtom } from '../../atoms'

export interface LikeButtonProps {
  postId: string
  targetUserId: string
  likeCount: number
  size?: 'small' | 'medium' | 'large'
  showCount?: boolean
  color?: 'primary' | 'secondary' | 'default'
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  targetUserId,
  likeCount,
  size = 'medium',
  showCount = true,
  color = 'primary',
}) => {
  const [authState] = useAtom(authAtom)
  const { togglePostLike, isPostLiked, isLoading } = usePostLike()
  const [postLikeState] = useAtom(postLikeStateAtom)

  const liked = isPostLiked(postId)
  const isAuthenticated = !!authState?.uid
  const likeCountDelta = postLikeState.likeCountDeltas[postId] || 0
  const displayLikeCount = likeCount + likeCountDelta

  const handleLikeClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!isAuthenticated) {
      console.warn('User must be authenticated to like posts')
      return
    }

    await togglePostLike(targetUserId, postId)
  }

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  }[size]

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <IconButton
        onClick={handleLikeClick}
        disabled={!isAuthenticated || isLoading}
        size={size}
        color={liked ? 'error' : 'default'}
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={iconSize} />
        ) : liked ? (
          <Favorite sx={{ fontSize: iconSize }} />
        ) : (
          <FavoriteBorder sx={{ fontSize: iconSize }} />
        )}
      </IconButton>
      
      {showCount && (
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          color="textSecondary"
          sx={{
            fontWeight: liked ? 600 : 400,
            transition: 'font-weight 0.2s ease-in-out',
          }}
        >
          {displayLikeCount}
        </Typography>
      )}
    </Box>
  )
}

export default LikeButton