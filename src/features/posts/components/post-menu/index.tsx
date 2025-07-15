import React, { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import { MoreVert, VolumeOff, VolumeUp, Share } from '@mui/icons-material'
import {
  usePostMute,
  useIsPostMuted,
  useIsPostMuteLoading,
} from '../../hooks/use-post-mute'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'

export interface PostMenuProps {
  postId: string
  postUid: string
  postTitle?: string
  onShare?: () => void
}

export const PostMenu: React.FC<PostMenuProps> = ({
  postId,
  postUid,
  postTitle = '投稿',
  onShare,
}) => {
  const [authState] = useAtom(authAtom)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { toggleMute } = usePostMute()
  const isMuted = useIsPostMuted(postId)
  const isLoading = useIsPostMuteLoading(postId)

  const isAuthenticated = !!authState?.uid
  const isOwnPost = authState?.uid === postUid
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMute = async () => {
    handleMenuClose()
    if (!isAuthenticated || isOwnPost) return
    await toggleMute(postUid, postId)
  }

  const handleShare = () => {
    handleMenuClose()
    onShare?.()
  }

  return (
    <>
      <Tooltip title='メニュー'>
        <IconButton
          onClick={handleMenuOpen}
          size='small'
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <MoreVert />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
          },
        }}
      >
        {/* 共有 */}
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <Share fontSize='small' />
          </ListItemIcon>
          <ListItemText>投稿を共有</ListItemText>
        </MenuItem>

        {/* 他のユーザーの投稿の場合のみ表示 */}
        {!isOwnPost &&
          isAuthenticated && [
            <Divider key='divider' />,

            /* ミュート */
            <MenuItem key='mute' onClick={handleMute} disabled={isLoading}>
              <ListItemIcon>
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : isMuted ? (
                  <VolumeUp fontSize='small' />
                ) : (
                  <VolumeOff fontSize='small' />
                )}
              </ListItemIcon>
              <ListItemText>
                {isMuted ? 'ミュートを解除' : '投稿をミュート'}
              </ListItemText>
            </MenuItem>,
          ]}
      </Menu>
    </>
  )
}

export default PostMenu
