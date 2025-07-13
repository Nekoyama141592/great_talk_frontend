import { CreatePostData } from '@shared/schema/create-post'

export interface ValidationErrors {
  title?: string
  description?: string
  image?: string
  systemPrompt?: string
}

export const validateCreatePostForm = (
  data: CreatePostData
): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.title.trim()) {
    errors.title = 'タイトルは必須です'
  } else if (data.title.trim().length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください'
  }

  if (!data.description.trim()) {
    errors.description = '説明は必須です'
  } else if (data.description.trim().length > 500) {
    errors.description = '説明は500文字以内で入力してください'
  }

  if (!data.systemPrompt.trim()) {
    errors.systemPrompt = 'システムプロンプトは必須です'
  }

  if (!data.pickedImage) {
    errors.image = '画像をアップロードしてください'
  }

  return errors
}

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0
}
