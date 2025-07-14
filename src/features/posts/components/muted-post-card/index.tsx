import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Fade,
} from '@mui/material'
import {
  VolumeOff,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { usePostMute } from '../../hooks/use-post-mute'
import { PublicPost } from '@shared/schema/public-post'

export interface MutedPostCardProps {
  post: PublicPost
  showContent?: boolean
  onUnmute?: () => void
}

export const MutedPostCard: React.FC<MutedPostCardProps> = ({
  post,
  showContent = false,
  onUnmute,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(showContent)
  const { unmutePost } = usePostMute()

  const handleUnmute = async () => {
    const success = await unmutePost(post.uid, post.postId)
    if (success) {
      onUnmute?.()
    }
  }

  const handleToggleContent = () => {
    setIsContentVisible(!isContentVisible)
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.main',
        bgcolor: 'grey.50',
        opacity: 0.7,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          opacity: 0.9,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* ミュート情報ヘッダー */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1,
            borderRadius: 1,
            bgcolor: 'warning.50',
            border: '1px solid',
            borderColor: 'warning.200',
          }}
        >
          <VolumeOff color="warning" fontSize="small" />
          <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
            ミュートされた投稿
          </Typography>
        </Box>

        {/* 投稿の基本情報（常に表示） */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1.5,
              bgcolor: 'grey.400',
            }}
          >
            <VolumeOff fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              ミュートされた投稿
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
            >
              投稿者: {post.uid}
            </Typography>
          </Box>
        </Box>

        {/* 投稿内容（トグル可能） */}
        {isContentVisible && (
          <Fade in={isContentVisible} timeout={300}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  mb: 1,
                  color: 'text.secondary',
                }}
              >
                {post.title.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.description.value}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* アクションボタン */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Button
            onClick={handleToggleContent}
            startIcon={isContentVisible ? <VisibilityOff /> : <Visibility />}
            size="small"
            color="inherit"
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
            }}
          >
            {isContentVisible ? '内容を非表示' : '内容を表示'}
          </Button>

          <Button
            onClick={handleUnmute}
            variant="outlined"
            size="small"
            color="warning"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            ミュートを解除
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MutedPostCard