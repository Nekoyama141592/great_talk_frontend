import React from 'react'
import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import { PersonAdd, PersonRemove } from '@mui/icons-material'
import { useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import { useFollow } from '../../hooks/use-follow'

interface FollowButtonCompactProps {
  targetUserId: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const FollowButtonCompact: React.FC<FollowButtonCompactProps> = ({
  targetUserId,
  size = 'medium',
  className,
}) => {
  const currentUserId = useAtomValue(uidAtom)
  const { toggleFollow, isFollowing, isLoadingFollowAction } = useFollow()

  const isCurrentUser = currentUserId === targetUserId
  const isFollowingUser = isFollowing(targetUserId)
  const isLoading = isLoadingFollowAction(targetUserId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await toggleFollow(targetUserId)
    } catch (err) {
      console.error('Follow toggle error:', err)
    }
  }

  if (isCurrentUser) {
    return null
  }

  const buttonColor = isFollowingUser ? 'secondary' : 'primary'
  const tooltipText = isFollowingUser ? 'アンフォロー' : 'フォロー'
  const icon = isFollowingUser ? <PersonRemove /> : <PersonAdd />

  return (
    <Tooltip title={tooltipText} arrow>
      <IconButton
        color={buttonColor}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isLoading}
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={size === 'small' ? 16 : 20} />
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  )
}