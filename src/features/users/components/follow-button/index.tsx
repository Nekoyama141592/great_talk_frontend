import React, { useState } from 'react'
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material'
import { PersonAdd, PersonRemove } from '@mui/icons-material'
import { useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import { useFollow } from '../../hooks/use-follow'

interface FollowButtonProps {
  targetUserId: string
  variant?: 'contained' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  className?: string
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  className,
}) => {
  const currentUserId = useAtomValue(uidAtom)
  const { toggleFollow, isFollowing, isLoadingFollowAction } = useFollow()
  const [error, setError] = useState<string | null>(null)

  const isCurrentUser = currentUserId === targetUserId
  const isFollowingUser = isFollowing(targetUserId)
  const isLoading = isLoadingFollowAction(targetUserId)

  const handleClick = async () => {
    try {
      setError(null)
      await toggleFollow(targetUserId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  if (isCurrentUser) {
    return null // Don't show follow button for current user
  }

  const buttonColor = isFollowingUser ? 'secondary' : 'primary'
  const buttonText = isFollowingUser ? 'アンフォロー' : 'フォロー'
  const icon = isFollowingUser ? <PersonRemove /> : <PersonAdd />

  return (
    <>
      <Button
        variant={variant}
        color={buttonColor}
        size={size}
        fullWidth={fullWidth}
        className={className}
        onClick={handleClick}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={16} /> : icon}
        sx={{
          minWidth: size === 'small' ? '80px' : '100px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 2,
          },
        }}
      >
        {isLoading ? '処理中...' : buttonText}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity='error' variant='filled'>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}
