import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  IconButton,
  Avatar,
  FormControl,
  FormHelperText,
} from '@mui/material'
import { PhotoCamera, Close } from '@mui/icons-material'
import { useCreatePost } from '../../hooks/use-create-post'
import { CreatePostData } from '@shared/schema/create-post'
import {
  validateCreatePostForm,
  hasValidationErrors,
} from '../../utils/form-validation'

const DEFAULT_SYSTEM_PROMPT = 'あなたは親切で丁寧なアシスタントです。'

export const CreatePostComponent = () => {
  const navigate = useNavigate()
  const { createPost, isLoading, error } = useCreatePost()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    description: '',
    pickedImage: null,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const handleInputChange =
    (field: keyof CreatePostData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }))

      // Clear validation error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setValidationErrors(prev => ({
          ...prev,
          image: '画像ファイルを選択してください',
        }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setValidationErrors(prev => ({
          ...prev,
          image: 'ファイルサイズは5MB以下にしてください',
        }))
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          pickedImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)

      // Clear image error
      if (validationErrors.image) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, pickedImage: null }))
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    const errors = validateCreatePostForm(formData)

    if (hasValidationErrors(errors)) {
      setValidationErrors(errors)
      return
    }

    if (!selectedFile) {
      setValidationErrors({ image: '画像をアップロードしてください' })
      return
    }

    try {
      await createPost({
        title: formData.title,
        systemPrompt: formData.systemPrompt,
        description: formData.description,
        image: selectedFile,
      })

      // Navigate back on success
      navigate('/')
    } catch {
      // Error is handled by the hook
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        投稿を作成
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box
            component='form'
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Title Field */}
            <TextField
              label='タイトル'
              value={formData.title}
              onChange={handleInputChange('title')}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              fullWidth
              required
            />

            {/* System Prompt Field */}
            <TextField
              label='システムプロンプト'
              value={formData.systemPrompt}
              onChange={handleInputChange('systemPrompt')}
              error={!!validationErrors.systemPrompt}
              helperText={validationErrors.systemPrompt}
              fullWidth
              multiline
              rows={3}
              required
            />

            {/* Description Field */}
            <TextField
              label='説明'
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              fullWidth
              multiline
              rows={4}
              required
            />

            {/* Image Upload */}
            <FormControl error={!!validationErrors.image}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id='image-upload'
                  />
                  <label htmlFor='image-upload'>
                    <Button
                      variant='outlined'
                      component='span'
                      startIcon={<PhotoCamera />}
                      disabled={isLoading}
                    >
                      画像をアップロード
                    </Button>
                  </label>
                </Box>

                {formData.pickedImage && (
                  <Box sx={{ position: 'relative', width: 'fit-content' }}>
                    <Avatar
                      src={formData.pickedImage}
                      sx={{ width: 200, height: 200 }}
                      variant='rounded'
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                      }}
                      size='small'
                    >
                      <Close />
                    </IconButton>
                  </Box>
                )}

                {validationErrors.image && (
                  <FormHelperText>{validationErrors.image}</FormHelperText>
                )}
              </Box>
            </FormControl>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Button
                variant='outlined'
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? '投稿中...' : '投稿する'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
