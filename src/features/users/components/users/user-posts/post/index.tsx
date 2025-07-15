import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db, functions } from '@shared/infrastructures/firebase'
import { PublicPost } from '@shared/schema/public-post'
import { useState } from 'react'
import { httpsCallable } from '@firebase/functions'
import ReactMarkdown from 'react-markdown'
import { LikeButton } from '@posts/components/like-button'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Skeleton
} from '@mui/material'
import { 
  MessageOutlined, 
  SendOutlined, 
  PersonOutlined,
  AccessTimeOutlined
} from '@mui/icons-material'

interface Response {
  model: string
  content: string
}
export const PostComponent = () => {
  const [response, setResponse] = useState<string>('')
  const { uid, postId } = useParams()
  const queryFn = async () => {
    if (!uid || !postId) return
    const docRef = doc(db, `public/v1/users/${uid}/posts`, postId)
    const postDoc = await getDoc(docRef)
    const data = postDoc.data()
    if (!data) return
    const res: PublicPost = {
      customCompleteText: data.customCompleteText,
      description: data.description,
      image: data.image,
      msgCount: data.msgCount,
      likeCount: data.likeCount || 0,
      postId: data.postId,
      title: data.title,
      uid: data.uid,
      createdAt: data.createdAt,
    }
    return res
  }
  const { data, isPending, error } = useQuery({
    queryKey: ['post'],
    queryFn: queryFn,
  })
  const [inputText, setInputText] = useState('')

  const onClick = async (systemPrompt: string, text: string) => {
    setResponse('読み込み中...')
    const generateText = httpsCallable(functions, 'generateTextV2')
    const combinedMessage = `${systemPrompt}\n\n${text}`
    const messages = [
      { role: 'user', content: combinedMessage },
    ]
    generateText({ 
      model: 'o4-mini-2025-04-16',
      messages 
    })
      .then(result => {
        const data = result.data as Response
        setResponse(data.content)
      })
      .catch(e => {
        setResponse(`エラーが発生しました: ${e}`)
      })
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    systemPrompt: string
  ) => {
    e.preventDefault()
    onClick(systemPrompt, inputText)
  }

  if (isPending) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={48} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="30%" height={24} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              投稿が存在しません
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error">
              エラーが発生しました
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {error.message}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const post: PublicPost = data
  const formatDate = (timestamp: { seconds: number } | null) => {
    if (!timestamp) return ''
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Main Post Card */}
      <Card 
        elevation={3} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme => theme.shadows[8]
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Post Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              <PersonOutlined />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {post?.uid}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <AccessTimeOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post?.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Post Title */}
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              lineHeight: 1.2
            }}
          >
            {post?.title.value}
          </Typography>

          {/* Post Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            {post?.description.value}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Post Stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Chip
              icon={<MessageOutlined />}
              label={`${post?.msgCount} コメント`}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                '& .MuiChip-icon': { fontSize: 18 }
              }}
            />
            <LikeButton
              postId={post.postId}
              targetUserId={post.uid}
              likeCount={post.likeCount}
              size='medium'
              showCount={true}
            />
          </Box>
        </CardContent>
      </Card>

      {/* AI Question Section */}
      <Card 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          mb: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            AIに質問する
          </Typography>
          
          <Box
            component="form"
            onSubmit={e => handleSubmit(e, post.customCompleteText.systemPrompt)}
            sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="この投稿について質問があれば、お気軽にどうぞ..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendOutlined />}
              disabled={!inputText.trim()}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: theme => theme.shadows[4],
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  opacity: 0.5
                }
              }}
            >
              送信
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* AI Response Section */}
      {response && (
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              AI回答
            </Typography>
            
            {response === '読み込み中...' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  AIが回答を生成しています...
                </Typography>
              </Box>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  backgroundColor: 'background.default',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.7,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        {children}
                      </Typography>
                    ),
                    h1: ({ children }) => (
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          mt: 3,
                          '&:first-of-type': { mt: 0 }
                        }}
                      >
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1.5,
                          mt: 2.5,
                          '&:first-of-type': { mt: 0 }
                        }}
                      >
                        {children}
                      </Typography>
                    ),
                    ul: ({ children }) => (
                      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                        {children}
                      </Box>
                    ),
                    li: ({ children }) => (
                      <Typography 
                        component="li" 
                        variant="body1" 
                        sx={{ mb: 0.5, lineHeight: 1.6 }}
                      >
                        {children}
                      </Typography>
                    ),
                    code: ({ children }) => (
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: 'action.hover',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.9em'
                        }}
                      >
                        {children}
                      </Box>
                    )
                  }}
                >
                  {response}
                </ReactMarkdown>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
