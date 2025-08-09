import React from 'react'
import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import { VolumeOff, VolumeUp } from '@mui/icons-material'
import {
  usePostMute,
  useIsPostMuted,
  useIsPostMuteLoading,
} from '../../hooks/use-post-mute'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'

export interface MuteButtonProps {
  postId: string
  postUid: string
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'default'
  showTooltip?: boolean
}

export const MuteButton: React.FC<MuteButtonProps> = ({
  postId,
  postUid,
  size = 'medium',
  color = 'default',
  showTooltip = true,
}) => {
  const [authState] = useAtom(authAtom)
  const { toggleMute } = usePostMute()
  const isMuted = useIsPostMuted(postId)
  const isLoading = useIsPostMuteLoading(postId)

  const isAuthenticated = !!authState?.uid
  const isOwnPost = authState?.uid === postUid

  const handleMuteClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated || isOwnPost) {
      return
    }

    await toggleMute(postUid, postId)
  }

  // 自分の投稿の場合はボタンを表示しない
  if (isOwnPost) {
    return null
  }

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  }[size]

  const tooltipText = isMuted ? 'ミュートを解除' : '投稿をミュート'

  const buttonContent = (
    <IconButton
      onClick={handleMuteClick}
      disabled={!isAuthenticated || isLoading}
      size={size}
      color={isMuted ? 'secondary' : color}
      sx={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
        opacity: isMuted ? 0.8 : 1,
      }}
    >
      {isLoading ? (
        <CircularProgress size={iconSize} />
      ) : isMuted ? (
        <VolumeOff sx={{ fontSize: iconSize }} />
      ) : (
        <VolumeUp sx={{ fontSize: iconSize }} />
      )}
    </IconButton>
  )

  if (showTooltip) {
    return (
      <Tooltip
        title={isAuthenticated ? tooltipText : 'ログインが必要です'}
        arrow
      >
        {buttonContent}
      </Tooltip>
    )
  }

  return buttonContent
}

export default MuteButton
