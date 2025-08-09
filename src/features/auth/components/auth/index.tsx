import { auth } from '@shared/infrastructures/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import {
  Box,
  Button,
  CardContent,
  Typography,
  Container,
  Paper,
  Fade,
  Zoom,
  CircularProgress,
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'

export const AuthComponent = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(0, 191, 109, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 191, 109, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(0, 191, 109, 0.06) 0%, transparent 50%)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      <Container maxWidth='sm'>
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'white',
              border: '1px solid #e2e8f0',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Box
              sx={{
                background: 'white',
                p: 6,
                textAlign: 'center',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Zoom in timeout={1200}>
                <Typography
                  variant='h3'
                  component='h1'
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    color: '#1e293b',
                    letterSpacing: '-0.02em',
                  }}
                >
                  GreatTalk
                </Typography>
              </Zoom>
              <Typography
                variant='h6'
                sx={{
                  color: '#64748b',
                  fontWeight: 400,
                  letterSpacing: '0.3px',
                }}
              >
                AI-Powered Social Platform
              </Typography>
            </Box>

            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography
                  variant='h4'
                  component='h2'
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: '#1e293b',
                    letterSpacing: '-0.01em',
                  }}
                >
                  ようこそ
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    color: '#64748b',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    mb: 3,
                    fontWeight: 400,
                  }}
                >
                  AIが創造する新しいソーシャル体験を
                  <br />
                  今すぐ始めましょう
                </Typography>
              </Box>

              <Zoom in timeout={1500}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : (
                      <GoogleIcon />
                    )
                  }
                  sx={{
                    py: 2.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: '#00BF6D',
                    color: 'white',
                    boxShadow:
                      '0 10px 15px -3px rgba(0, 191, 109, 0.3), 0 4px 6px -2px rgba(0, 191, 109, 0.2)',
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow:
                        '0 15px 20px -3px rgba(0, 191, 109, 0.4), 0 8px 10px -2px rgba(0, 191, 109, 0.3)',
                      background: '#00A85E',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                    '&:disabled': {
                      background: '#94a3b8',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {isLoading ? 'ログイン中...' : 'Googleでログイン'}
                </Button>
              </Zoom>

              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  ログインすることで、あなたは私たちの
                  <br />
                  <Box
                    component='span'
                    sx={{ color: '#00BF6D', fontWeight: 500 }}
                  >
                    利用規約
                  </Box>
                  および
                  <Box
                    component='span'
                    sx={{ color: '#00BF6D', fontWeight: 500 }}
                  >
                    プライバシーポリシー
                  </Box>
                  に同意したものとみなされます
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Fade>
      </Container>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.02); }
          }
        `}
      </style>
    </Box>
  )
}
