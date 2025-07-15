import React from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  CardMedia,
  Fade,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material'
import { 
  AutoAwesome, 
  Download, 
  Refresh, 
  ImageSearch,
  Palette,
  AspectRatio,
} from '@mui/icons-material'
import { useImageGeneration } from '../hooks/use-image-generation'

const ImageGenerationPage: React.FC = () => {
  const {
    state,
    updatePrompt,
    updateSize,
    generateImage,
    setError,
    resetState,
  } = useImageGeneration()

  const handleDownload = () => {
    if (!state.generatedImage) return

    const link = document.createElement('a')
    link.href = `data:image/png;base64,${state.generatedImage}`
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sizeOptions = [
    { value: '1024x1024', label: 'スクエア (1:1)', description: '1024×1024px' },
    { value: '1536x1024', label: '横長 (3:2)', description: '1536×1024px' },
    { value: '1024x1536', label: '縦長 (2:3)', description: '1024×1536px' },
  ] as const

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(139, 92, 246, 0.3)',
            }}
          >
            <AutoAwesome sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>
        <Typography
          variant='h3'
          component='h1'
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em',
          }}
        >
          ✨ AI画像生成スタジオ
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          あなたの想像力を美しいビジュアルに変換します。
          <br />
          言葉で描く、AIが創造する新しい表現の世界へようこそ。
        </Typography>
      </Box>

      {/* Main Generation Card */}
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
            height: '4px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          },
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Prompt Input Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Palette sx={{ fontSize: 24, color: '#8b5cf6', mr: 2 }} />
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🎨 創造のプロンプト
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={5}
                label='画像の詳細な説明を入力してください'
                placeholder='例: 幻想的な森の中で光る蝶が舞っている、神秘的で美しい夜景'
                value={state.prompt}
                onChange={e => updatePrompt(e.target.value)}
                variant='outlined'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8b5cf6',
                      },
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8b5cf6',
                  },
                }}
              />
            </Box>

            {/* Size Selection Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AspectRatio sx={{ fontSize: 24, color: '#3b82f6', mr: 2 }} />
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  📐 画像サイズ
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel sx={{ fontWeight: 600 }}>サイズを選択</InputLabel>
                <Select
                  value={state.size}
                  label='サイズを選択'
                  onChange={e => updateSize(e.target.value as typeof state.size)}
                  sx={{
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                    },
                  }}
                >
                  {sizeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ py: 1 }}>
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Generate Button */}
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant='contained'
                size='large'
                onClick={generateImage}
                disabled={state.isLoading || !state.prompt.trim()}
                startIcon={
                  state.isLoading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <ImageSearch />
                  )
                }
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: 4,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: state.isLoading
                    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  boxShadow: state.isLoading
                    ? 'none'
                    : '0 12px 32px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    background: state.isLoading
                      ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    transform: state.isLoading ? 'none' : 'translateY(-2px)',
                    boxShadow: state.isLoading
                      ? 'none'
                      : '0 16px 40px rgba(139, 92, 246, 0.5)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                    color: '#64748b',
                  },
                }}
              >
                {state.isLoading ? '🎨 創造中...' : '✨ 画像を生成する'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Display */}
      {state.error && (
        <Fade in>
          <Alert 
            severity='error' 
            sx={{ 
              mt: 4,
              borderRadius: 3,
              '& .MuiAlert-message': {
                fontWeight: 600,
              },
            }} 
            onClose={() => setError(null)}
          >
            {state.error}
          </Alert>
        </Fade>
      )}

      {/* Generated Image Display */}
      {state.generatedImage && (
        <Fade in timeout={800}>
          <Card
            sx={{
              mt: 6,
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
                height: '4px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 24, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant='h5' 
                    component='h2'
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🎉 生成完了
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={
                      sizeOptions.find(opt => opt.value === state.size)?.label
                    }
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip title='画像をダウンロード' arrow>
                    <IconButton
                      onClick={handleDownload}
                      sx={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='新しい画像を生成' arrow>
                    <IconButton
                      onClick={resetState}
                      sx={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.5)',
                  p: 2,
                }}
              >
                <CardMedia
                  component='img'
                  image={`data:image/png;base64,${state.generatedImage}`}
                  alt='Generated image'
                  sx={{
                    borderRadius: 2,
                    maxWidth: '100%',
                    height: 'auto',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              </Box>

              {state.prompt && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    sx={{
                      fontWeight: 700,
                      color: '#8b5cf6',
                      mb: 1,
                    }}
                  >
                    💭 使用されたプロンプト
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      fontStyle: 'italic',
                      color: 'text.primary',
                      lineHeight: 1.6,
                    }}
                  >
                    &ldquo;{state.prompt}&rdquo;
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      )}
    </Container>
  )
}

export default ImageGenerationPage
