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
  Grid,
} from '@mui/material'
import { Person, Article, Verified } from '@mui/icons-material'
import { FollowButton } from '../../follow-button'
import { useFollowingUsers } from '../../../hooks/use-following-users'
import { UserMenu } from '../../user-menu'
import { useUserMute, useIsUserMuted } from '../../../hooks/use-user-mute'
import { useAtom } from 'jotai'
import { authAtom } from '@auth/atoms'
import { useEffect } from 'react'

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

  const userData: PublicUser = data

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mr: 3,
                bgcolor: 'primary.main',
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant='h4' component='h1' sx={{ mr: 1 }}>
                  {userData?.userName.value ?? ''}
                </Typography>
                {userData?.isOfficial && (
                  <Chip
                    icon={<Verified />}
                    label='公式'
                    color='primary'
                    variant='outlined'
                    size='small'
                  />
                )}
              </Box>

              <Typography variant='body1' color='textSecondary' sx={{ mb: 2 }}>
                {userData?.bio.value ?? '自己紹介がありません'}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <Typography variant='body2'>
                    <strong>{userData?.followerCount ?? 0}</strong> フォロワー
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body2'>
                    <strong>{userData?.followingCount ?? 0}</strong> フォロー中
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body2'>
                    <strong>{userData?.postCount ?? 0}</strong> 投稿
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {!isOwnProfile && (
                  <FollowButton
                    targetUserId={uid!}
                    variant='contained'
                    size='medium'
                  />
                )}
                <Button
                  component={Link}
                  to='posts'
                  variant='outlined'
                  startIcon={<Article />}
                >
                  投稿一覧
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
