import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
  Collapse,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material'
import {
  PersonOff,
  ExpandMore,
  ExpandLess,
  PersonAddAlt1
} from '@mui/icons-material'
import { useUserMute, useIsUserMuteLoading } from '../../hooks/use-user-mute'

export interface MutedUserCardProps {
  user: {
    uid: string
    displayName?: string
    email?: string
    photoURL?: string
  }
}

export const MutedUserCard: React.FC<MutedUserCardProps> = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { unmuteUser } = useUserMute()
  const isLoading = useIsUserMuteLoading(user.uid)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleUnmute = async () => {
    await unmuteUser(user.uid)
  }

  const displayName = user.displayName || user.email || 'Unknown User'

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.main',
        bgcolor: 'warning.50',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* ミュート状態の表示 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonOff 
            sx={{ 
              color: 'warning.main', 
              mr: 1,
              fontSize: 20
            }} 
          />
          <Typography 
            variant="body2" 
            color="warning.dark"
            sx={{ fontWeight: 500 }}
          >
            このユーザーをミュートしています
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title={isExpanded ? '詳細を隠す' : '詳細を表示'}>
              <IconButton
                onClick={handleToggleExpand}
                size="small"
                sx={{ color: 'warning.main' }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ユーザー情報の詳細表示 */}
        <Collapse in={isExpanded}>
          <Box sx={{ pl: 1, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={user.photoURL}
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  filter: 'grayscale(100%)',
                  opacity: 0.7
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    opacity: 0.8
                  }}
                >
                  {displayName}
                </Typography>
                {user.email && user.displayName && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ opacity: 0.7 }}
                  >
                    {user.email}
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                mb: 2,
                fontStyle: 'italic',
                opacity: 0.8
              }}
            >
              このユーザーの投稿やアクティビティは非表示になっています
            </Typography>
          </Box>
        </Collapse>

        {/* ミュート解除ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            onClick={handleUnmute}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <PersonAddAlt1 />
              )
            }
            variant="outlined"
            color="warning"
            size="small"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                bgcolor: 'warning.100',
              }
            }}
          >
            {isLoading ? 'ミュート解除中...' : 'ミュートを解除'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MutedUserCard