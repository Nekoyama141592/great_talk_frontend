import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicUser } from '@shared/schema/public-user'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import { Person, Article, Verified } from '@mui/icons-material'
import { FollowButton } from '../../follow-button'
import { useFollowingUsers } from '../../../hooks/use-following-users'
import { UserMenu } from '../../user-menu'
import { useUserMute, useIsUserMuted } from '../../../hooks/use-user-mute'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'
import { useEffect } from 'react'
import { getUserImageUrl } from '@/utils/image_url_util'

export const UserComponent = () => {
  const { uid } = useParams()
  const [authState] = useAtom(authAtom)
  const { initializeMuteTokens } = useUserMute()
  const isMuted = useIsUserMuted(uid || '')
  // Initialize following users data
  useFollowingUsers()

  // Initialize user mute tokens on component mount
  useEffect(() => {
    if (authState?.uid) {
      initializeMuteTokens()
    }
  }, [authState?.uid, initializeMuteTokens])

  const isOwnProfile = authState?.uid === uid

  const queryFn = async () => {
    if (!uid) return
    const docRef = doc(db, 'public/v1/users', uid)
    const userDoc = await getDoc(docRef)
    const data = userDoc.data()
    if (!data) return
    const res: PublicUser = {
      bio: data.bio,
      ethAddress: data.ethAddress,
      followerCount: data.followerCount,
      followingCount: data.followingCount,
      isNFTicon: data.isNFTicon,
      isOfficial: data.isOfficial,
      isSuspended: data.isSuspended,
      muteCount: data.muteCount,
      postCount: data.postCount,
      uid: data.uid,
      image: data.image,
      userName: data.userName,
    }
    return res
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['user', uid],
    queryFn: queryFn,
    enabled: !!uid,
  })

  if (isPending)
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    )

  if (!data)
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography>ユーザーが存在しません</Typography>
      </Container>
    )

  if (error)
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography color='error'>{error.message}</Typography>
      </Container>
    )

  const userData = data as PublicUser

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Card
        sx={{
          borderRadius: 4,
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(226, 232, 240, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background:
              'linear-gradient(135deg, #22c55e 0%, #3b82f6 25%, #8b5cf6 50%, #f97316 75%, #ef4444 100%)',
          },
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Avatar
              src={uid ? getUserImageUrl(uid) : undefined}
              sx={{
                width: 120,
                height: 120,
                mr: 4,
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0 12px 32px rgba(34, 197, 94, 0.3)',
                border: '4px solid rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(2deg)',
                  boxShadow: '0 16px 40px rgba(34, 197, 94, 0.4)',
                },
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant='h3'
                  component='h1'
                  sx={{
                    mr: 2,
                    fontWeight: 800,
                    background:
                      'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {userData?.userName.value ?? ''}
                </Typography>
                {userData?.isOfficial && (
                  <Chip
                    icon={<Verified />}
                    label='✨ 公式'
                    sx={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      border: 'none',
                    }}
                  />
                )}
              </Box>

              <Typography
                variant='h6'
                sx={{
                  mb: 3,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                  fontStyle: userData?.bio.value ? 'normal' : 'italic',
                }}
              >
                {userData?.bio.value ?? '🤔 自己紹介がまだ設定されていません'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    minWidth: 100,
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 800, color: '#22c55e' }}
                  >
                    {userData?.followerCount ?? 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontWeight: 600 }}
                  >
                    フォロワー
                  </Typography>
                </Box>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    minWidth: 100,
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 800, color: '#3b82f6' }}
                  >
                    {userData?.followingCount ?? 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontWeight: 600 }}
                  >
                    フォロー中
                  </Typography>
                </Box>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(249, 115, 22, 0.1)',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    minWidth: 100,
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 800, color: '#f97316' }}
                  >
                    {userData?.postCount ?? 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontWeight: 600 }}
                  >
                    投稿
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {!isOwnProfile && (
                  <FollowButton
                    targetUserId={uid!}
                    variant='contained'
                    size='large'
                  />
                )}
                <Button
                  component={Link}
                  to='posts'
                  variant='outlined'
                  startIcon={<Article />}
                  size='large'
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#2563eb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  📚 投稿一覧
                </Button>

                {/* ユーザーメニュー */}
                <UserMenu
                  userId={uid!}
                  userName={userData?.userName.value}
                  isOwnProfile={isOwnProfile}
                  onShare={() => {
                    navigator.share?.({
                      title: `${userData?.userName.value}さんのプロフィール`,
                      text: userData?.bio.value || '',
                      url: window.location.href,
                    })
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* ミュート状態の表示 */}
          {isMuted && !isOwnProfile && (
            <>
              <Divider sx={{ my: 2 }} />
              <Chip
                label='このユーザーをミュートしています'
                color='warning'
                variant='outlined'
              />
            </>
          )}

          {userData?.isSuspended && (
            <>
              <Divider sx={{ my: 2 }} />
              <Chip
                label='このアカウントは停止されています'
                color='error'
                variant='outlined'
              />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
