import React from 'react'
import { IconButton, CircularProgress } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useAtom } from 'jotai'
import { usePostLike } from '../../hooks/use-post-like'
import { authAtom } from '@auth/atoms'

export interface LikeButtonCompactProps {
  postId: string
  targetUserId: string
  size?: 'small' | 'medium' | 'large'
}

export const LikeButtonCompact: React.FC<LikeButtonCompactProps> = ({
  postId,
  targetUserId,
  size = 'small',
}) => {
  const [authState] = useAtom(authAtom)
  const { togglePostLike, isPostLiked, isLoading } = usePostLike()

  const liked = isPostLiked(postId)
  const isAuthenticated = !!authState?.uid

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
        '&:disabled': {
          opacity: 0.5,
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
  )
}

export default LikeButtonCompact