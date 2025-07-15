import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicUser } from '@shared/schema/public-user'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Chip,
} from '@mui/material'
import { Person, Verified } from '@mui/icons-material'
import { FollowButtonCompact } from '../../follow-button/FollowButtonCompact'
import { useFollowingUsers } from '../../../hooks/use-following-users'
export const UserIndexComponent = () => {
  // Initialize following users data
  useFollowingUsers()

  const queryFn = async () => {
    const colRef = collection(db, `public/v1/users`)
    const q = query(colRef, orderBy('followerCount', 'desc'), limit(30))
    const querySnapshot = await getDocs(q)

    const usersData: PublicUser[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
      const res: PublicUser = {
        bio: data.bio,
        blockCount: data.blockCount,
        ethAddress: data.ethAddress,
        followerCount: data.followerCount,
        followingCount: data.followingCount,
        isNFTicon: data.isNFTicon,
        isOfficial: data.isOfficial,
        isSuspended: data.isSuspended,
        muteCount: data.muteCount,
        postCount: data.postCount,
        reportCount: data.reportCount,
        uid: data.uid,
        image: data.image,
        userName: data.userName,
      }
      return res
    })
    return usersData
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['users'],
    queryFn: queryFn,
  })

  if (error)
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography color='error'>{error.message}</Typography>
      </Container>
    )

  if (isPending)
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    )

  if (!data)
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography>データがありません</Typography>
      </Container>
    )

  const users: PublicUser[] = data

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        人気ユーザー
      </Typography>

      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.uid}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    <Person />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      <Typography
                        variant='h6'
                        component={Link}
                        to={`/users/${user.uid}`}
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': { color: 'primary.main' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {user.userName.value}
                      </Typography>
                      {user.isOfficial && (
                        <Chip
                          icon={<Verified />}
                          label='公式'
                          color='primary'
                          variant='outlined'
                          size='small'
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant='body2'
                      color='textSecondary'
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                        minHeight: '40px',
                      }}
                    >
                      {user.bio.value || '自己紹介がありません'}
                    </Typography>

                    <Typography variant='body2' color='textSecondary'>
                      <strong>{user.followerCount}</strong> フォロワー
                    </Typography>
                  </Box>

                  <FollowButtonCompact targetUserId={user.uid} size='small' />
                </Box>

                {user.isSuspended && (
                  <Chip
                    label='停止中'
                    color='error'
                    variant='outlined'
                    size='small'
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
