import React from 'react'
import {
  Container,
  Paper,
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
  Card,
  CardMedia,
  Fade,
  Chip,
} from '@mui/material'
import { PhotoCamera, Download, Refresh } from '@mui/icons-material'
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
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PhotoCamera sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant='h4' component='h1' fontWeight='bold'>
              AI画像生成
            </Typography>
          </Box>

          <Typography variant='body1' sx={{ mb: 4, opacity: 0.9 }}>
            テキストから美しい画像を生成します。あなたのアイデアを言葉で表現してください。
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Prompt Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label='画像の説明（プロンプト）'
              placeholder='例: 美しい夕日の海辺、波が穏やかに打ち寄せている'
              value={state.prompt}
              onChange={e => updatePrompt(e.target.value)}
              variant='filled'
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
              }}
            />

            {/* Size Selection */}
            <FormControl fullWidth variant='filled'>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                画像サイズ
              </InputLabel>
              <Select
                value={state.size}
                onChange={e => updateSize(e.target.value as typeof state.size)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {sizeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant='body1'>{option.label}</Typography>
                      <Typography variant='caption' color='textSecondary'>
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Generate Button */}
            <Button
              variant='contained'
              size='large'
              onClick={generateImage}
              disabled={state.isLoading || !state.prompt.trim()}
              startIcon={
                state.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <PhotoCamera />
                )
              }
              sx={{
                py: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {state.isLoading ? '生成中...' : '画像を生成'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {state.error && (
        <Fade in>
          <Alert severity='error' sx={{ mt: 3 }} onClose={() => setError(null)}>
            {state.error}
          </Alert>
        </Fade>
      )}

      {/* Generated Image Display */}
      {state.generatedImage && (
        <Fade in>
          <Card sx={{ mt: 3, overflow: 'visible' }}>
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6' component='h2'>
                  生成された画像
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={
                      sizeOptions.find(opt => opt.value === state.size)?.label
                    }
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<Download />}
                    onClick={handleDownload}
                  >
                    ダウンロード
                  </Button>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<Refresh />}
                    onClick={resetState}
                  >
                    リセット
                  </Button>
                </Box>
              </Box>

              <CardMedia
                component='img'
                image={`data:image/png;base64,${state.generatedImage}`}
                alt='Generated image'
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />

              {state.prompt && (
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}
                >
                  プロンプト: {state.prompt}
                </Typography>
              )}
            </Box>
          </Card>
        </Fade>
      )}
    </Container>
  )
}

export default ImageGenerationPage
