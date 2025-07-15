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
import {
  MoreVert,
  PersonOff,
  PersonAddAlt1,
  Share,
  CheckCircle,
} from '@mui/icons-material'
import {
  useUserMute,
  useIsUserMuted,
  useIsUserMuteLoading,
} from '../../hooks/use-user-mute'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'

export interface UserMenuProps {
  userId: string
  userName?: string
  onShare?: () => void
  onFollow?: () => void
  onUnfollow?: () => void
  isFollowing?: boolean
  isOwnProfile?: boolean
}

export const UserMenu: React.FC<UserMenuProps> = ({
  userId,
  _userName = 'ユーザー',
  onShare,
  onFollow,
  onUnfollow,
  isFollowing = false,
  isOwnProfile = false,
}) => {
  const [authState] = useAtom(authAtom)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { toggleMute } = useUserMute()
  const isMuted = useIsUserMuted(userId)
  const isLoading = useIsUserMuteLoading(userId)

  const isAuthenticated = !!authState?.uid
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
    if (!isAuthenticated || isOwnProfile) return
    await toggleMute(userId)
  }

  const handleShare = () => {
    handleMenuClose()
    onShare?.()
  }

  const handleFollow = () => {
    handleMenuClose()
    onFollow?.()
  }

  const handleUnfollow = () => {
    handleMenuClose()
    onUnfollow?.()
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
          <ListItemText>プロフィールを共有</ListItemText>
        </MenuItem>

        {/* フォロー・アンフォロー */}
        {isAuthenticated &&
          !isOwnProfile && [
            <MenuItem
              key='follow'
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              <ListItemIcon>
                {isFollowing ? (
                  <CheckCircle fontSize='small' />
                ) : (
                  <PersonAddAlt1 fontSize='small' />
                )}
              </ListItemIcon>
              <ListItemText>
                {isFollowing ? 'フォローを解除' : 'フォローする'}
              </ListItemText>
            </MenuItem>,

            <Divider key='divider' />,

            /* ユーザーミュート */
            <MenuItem key='mute' onClick={handleMute} disabled={isLoading}>
              <ListItemIcon>
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : isMuted ? (
                  <PersonAddAlt1 fontSize='small' />
                ) : (
                  <PersonOff fontSize='small' />
                )}
              </ListItemIcon>
              <ListItemText>
                {isMuted ? 'ミュートを解除' : 'ユーザーをミュート'}
              </ListItemText>
            </MenuItem>,
          ]}
      </Menu>
    </>
  )
}

export default UserMenu
