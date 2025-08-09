import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'
import { PublicUser } from '@shared/schema/public-user'
import { LikeButton } from '@posts/components/like-button'
import { getUserImageUrl, getPostImageUrl } from '@/utils/image_url_util'
import { useUserImageModeration } from '@users/hooks/use-user-image-moderation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Container,
  Grid,
  Skeleton,
  Fade,
  Stack,
  Badge,
  Paper,
} from '@mui/material'
import {
  Person,
  ChatBubbleOutline,
  AccessTime,
  ImageOutlined,
  VisibilityRounded,
  TrendingUpRounded,
  StarRounded,
} from '@mui/icons-material'

export const PostIndexComponent = () => {
  const { uid } = useParams()

  // ユーザー情報を取得
  const userQueryFn = async () => {
    if (!uid) return null
    const docRef = doc(db, 'public/v1/users', uid)
    const userDoc = await getDoc(docRef)
    const data = userDoc.data()
    if (!data) return null
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

  const { data: userData } = useQuery({
    queryKey: ['user', uid],
    queryFn: userQueryFn,
    enabled: !!uid,
  })

  const { data: userImageModeration } = useUserImageModeration(uid!)

  const postsQueryFn = async () => {
    if (!uid) return []
    const colRef = collection(db, `public/v1/users/${uid}/posts`)
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(30))
    const querySnapshot = await getDocs(q)

    const postsData: PublicPost[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        customCompleteText: data.customCompleteText,
        description: data.description,
        image: data.image,
        msgCount: data.msgCount,
        likeCount: data.likeCount || 0,
        uid: data.uid,
        postId: data.postId,
        title: data.title,
        createdAt: data.createdAt,
      }
    })
    return postsData
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['user-posts', uid],
    queryFn: postsQueryFn,
    enabled: !!uid,
  })

  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp) return ''
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography color='error' variant='h6' align='center'>
          {error.message}
        </Typography>
      </Container>
    )
  }

  if (isPending) {
    return (
      <Container maxWidth='lg' sx={{ py: 6 }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
          borderRadius: 6,
          p: 4,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Grid container spacing={4}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Fade in={true} timeout={500 + index * 150}>
                  <Card
                    sx={{
                      borderRadius: 5,
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Skeleton 
                        variant='rectangular' 
                        height={240}
                        sx={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite',
                          '@keyframes shimmer': {
                            '0%': { backgroundPosition: '-200% 0' },
                            '100%': { backgroundPosition: '200% 0' },
                          },
                        }} 
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}>
                        <Skeleton variant='circular' width={32} height={32} />
                        <Skeleton variant='circular' width={32} height={32} />
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Skeleton 
                          variant='circular' 
                          width={48} 
                          height={48}
                          sx={{ 
                            background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                          }}
                        />
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <Skeleton variant='text' width='70%' height={28} sx={{ mb: 0.5 }} />
                          <Skeleton variant='text' width='50%' height={20} />
                        </Box>
                        <Skeleton variant='circular' width={24} height={24} />
                      </Box>
                      <Skeleton variant='text' width='100%' height={36} sx={{ mb: 1 }} />
                      <Skeleton variant='text' width='85%' height={28} sx={{ mb: 3 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Skeleton variant='rounded' width={70} height={32} sx={{ borderRadius: 2 }} />
                          <Skeleton variant='rounded' width={60} height={32} sx={{ borderRadius: 2 }} />
                        </Box>
                        <Skeleton variant='rounded' width={80} height={36} sx={{ borderRadius: 3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Container maxWidth='lg' sx={{ py: 12 }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 6,
            p: 8,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
              borderRadius: 6,
              zIndex: -1,
            }
          }}>
            <Box sx={{ 
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}>
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 10,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                }
              }}>
                <ImageOutlined sx={{ 
                  fontSize: 48, 
                  color: 'rgba(99, 102, 241, 0.7)',
                  position: 'relative',
                  zIndex: 1,
                }} />
              </Box>
              <Box sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}>
                <StarRounded sx={{ fontSize: 18, color: 'white' }} />
              </Box>
            </Box>
            
            <Typography 
              variant='h4' 
              sx={{ 
                mb: 2, 
                background: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.025em',
              }}
            >
              まだ投稿がありません
            </Typography>
            
            <Typography 
              variant='h6' 
              sx={{ 
                mb: 4,
                color: 'rgba(100, 116, 139, 0.8)',
                fontWeight: 500,
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {userData?.userName?.value || 'このユーザー'}の最初の投稿をお待ちください
            </Typography>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}>
              <Chip
                icon={<TrendingUpRounded />}
                label='新着投稿'
                variant='outlined'
                sx={{
                  borderRadius: 3,
                  height: 40,
                  px: 2,
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                  color: 'rgba(59, 130, 246, 0.8)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <Chip
                icon={<VisibilityRounded />}
                label='フォロー中'
                variant='outlined'
                sx={{
                  borderRadius: 3,
                  height: 40,
                  px: 2,
                  background: 'rgba(168, 85, 247, 0.05)',
                  borderColor: 'rgba(168, 85, 247, 0.2)',
                  color: 'rgba(168, 85, 247, 0.8)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(168, 85, 247, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </Box>
          </Box>
        </Fade>
      </Container>
    )
  }

  const posts: PublicPost[] = data

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
      minHeight: '100vh',
      py: 6,
    }}>
      <Container maxWidth='xl' sx={{ position: 'relative' }}>
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }} />

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} lg={4} key={post.postId}>
              <Fade in={true} timeout={400 + index * 150}>
                <Paper
                  component={Link}
                  to={`${post.postId}`}
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 5,
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformOrigin: 'center',
                    cursor: 'pointer',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 1,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      '&::before': {
                        opacity: 1,
                      },
                      '& .post-image': {
                        transform: 'scale(1.1) rotate(1deg)',
                        filter: 'brightness(1.05) saturate(1.1)',
                      },
                      '& .user-avatar': {
                        transform: 'scale(1.15)',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                      },
                      '& .post-title': {
                        color: 'rgba(99, 102, 241, 0.9)',
                      },
                      '& .action-buttons': {
                        transform: 'translateY(-4px)',
                        '& > *': {
                          transform: 'scale(1.05)',
                        }
                      },
                    },
                  }}
                >
                  {/* Floating Action Buttons */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 3,
                    display: 'flex',
                    gap: 1,
                  }}>
                  </Box>

                  {/* Premium Post Badge */}
                  {post.likeCount > 10 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 3,
                    }}>
                      <Chip
                        icon={<TrendingUpRounded />}
                        label="人気"
                        size="small"
                        sx={{
                          height: 28,
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                          '& .MuiChip-icon': {
                            color: 'white',
                            fontSize: 14,
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Enhanced Post Image */}
                  {post.image?.moderationModelVersion ? (
                    <Box
                      sx={{
                        height: 280,
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
                      }}
                    >
                      <Box
                        component='img'
                        src={getPostImageUrl(post.uid, post.postId)}
                        alt={post.title.value}
                        className='post-image'
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          filter: 'brightness(0.98) contrast(1.05)',
                        }}
                        onError={e => {
                          const target = e.target as HTMLElement
                          target.style.display = 'none'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 80,
                          background: 'linear-gradient(transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: 280,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.3) 100%)',
                        border: '2px dashed rgba(203, 213, 225, 0.6)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 120,
                          height: 120,
                          background: 'radial-gradient(circle, rgba(148, 163, 184, 0.1) 0%, transparent 70%)',
                          borderRadius: '50%',
                        }
                      }}
                    >
                      <ImageOutlined sx={{ 
                        fontSize: 64, 
                        color: 'rgba(148, 163, 184, 0.7)',
                        position: 'relative',
                        zIndex: 1,
                      }} />
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    {/* Enhanced User Info */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          userData?.isOfficial && (
                            <Box sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid white',
                              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                            }}>
                              <StarRounded sx={{ fontSize: 10, color: 'white' }} />
                            </Box>
                          )
                        }
                      >
                        <Avatar
                          src={
                            userImageModeration?.hasModeratedImage
                              ? getUserImageUrl(uid!)
                              : undefined
                          }
                          className='user-avatar'
                          sx={{
                            width: 52,
                            height: 52,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            border: '3px solid rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                            fontSize: 22,
                          }}
                        >
                          <Person sx={{ fontSize: 24, color: 'white' }} />
                        </Avatar>
                      </Badge>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant='h6'
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'rgba(30, 41, 59, 0.9)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 0.5,
                          }}
                        >
                          {userData?.userName?.value || uid}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTime sx={{ fontSize: 14, color: 'rgba(100, 116, 139, 0.7)' }} />
                          <Typography
                            variant='caption'
                            sx={{ 
                              color: 'rgba(100, 116, 139, 0.7)', 
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          >
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Premium Post Title */}
                    <Typography
                      variant='h5'
                      className='post-title'
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.35rem',
                        mb: 2,
                        color: 'rgba(30, 41, 59, 0.9)',
                        lineHeight: 1.3,
                        letterSpacing: '-0.025em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {post.title.value}
                    </Typography>

                    {/* Enhanced Post Description */}
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'rgba(100, 116, 139, 0.8)',
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                        mb: 3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        fontWeight: 400,
                      }}
                    >
                      {post.description.value}
                    </Typography>

                    {/* Enhanced Post Stats */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      className='action-buttons'
                      sx={{
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Chip
                          icon={<ChatBubbleOutline />}
                          label={post.msgCount}
                          size='small'
                          variant='outlined'
                          sx={{
                            borderRadius: 3,
                            height: 36,
                            px: 1.5,
                            background: 'rgba(59, 130, 246, 0.08)',
                            borderColor: 'rgba(59, 130, 246, 0.2)',
                            color: 'rgba(59, 130, 246, 0.9)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& .MuiChip-icon': {
                              fontSize: 16,
                              color: 'rgba(59, 130, 246, 0.8)',
                            },
                            '&:hover': {
                              background: 'rgba(59, 130, 246, 0.15)',
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                            }
                          }}
                        />
                      </Stack>
                      <Box 
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        sx={{ 
                          transform: 'scale(1.1)',
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'scale(1.15)',
                          }
                        }}
                      >
                        <LikeButton
                          postId={post.postId}
                          targetUserId={post.uid}
                          likeCount={post.likeCount}
                          size='medium'
                          showCount={true}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
