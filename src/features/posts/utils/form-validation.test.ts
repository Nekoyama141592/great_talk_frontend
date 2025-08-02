import { describe, it, expect } from 'vitest'
import { validateCreatePostForm, hasValidationErrors } from './form-validation'
import { CreatePostData } from '@shared/schema/create-post'

const createValidPostData = (): CreatePostData => ({
  title: 'Valid Title',
  description: 'Valid description content',
  systemPrompt: 'Valid system prompt',
  pickedImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
})

describe('Form Validation', () => {
  describe('validateCreatePostForm', () => {
    it('should return no errors for valid data', () => {
      const validData = createValidPostData()
      const errors = validateCreatePostForm(validData)
      expect(errors).toEqual({})
    })

    describe('title validation', () => {
      it('should require title', () => {
        const data = { ...createValidPostData(), title: '' }
        const errors = validateCreatePostForm(data)
        expect(errors.title).toBe('タイトルは必須です')
      })

      it('should require non-whitespace title', () => {
        const data = { ...createValidPostData(), title: '   ' }
        const errors = validateCreatePostForm(data)
        expect(errors.title).toBe('タイトルは必須です')
      })

      it('should reject title over 100 characters', () => {
        const longTitle = 'a'.repeat(101)
        const data = { ...createValidPostData(), title: longTitle }
        const errors = validateCreatePostForm(data)
        expect(errors.title).toBe('タイトルは100文字以内で入力してください')
      })

      it('should accept title exactly 100 characters', () => {
        const title100 = 'a'.repeat(100)
        const data = { ...createValidPostData(), title: title100 }
        const errors = validateCreatePostForm(data)
        expect(errors.title).toBeUndefined()
      })
    })

    describe('description validation', () => {
      it('should require description', () => {
        const data = { ...createValidPostData(), description: '' }
        const errors = validateCreatePostForm(data)
        expect(errors.description).toBe('説明は必須です')
      })

      it('should require non-whitespace description', () => {
        const data = { ...createValidPostData(), description: '   ' }
        const errors = validateCreatePostForm(data)
        expect(errors.description).toBe('説明は必須です')
      })

      it('should reject description over 500 characters', () => {
        const longDescription = 'a'.repeat(501)
        const data = { ...createValidPostData(), description: longDescription }
        const errors = validateCreatePostForm(data)
        expect(errors.description).toBe('説明は500文字以内で入力してください')
      })

      it('should accept description exactly 500 characters', () => {
        const description500 = 'a'.repeat(500)
        const data = { ...createValidPostData(), description: description500 }
        const errors = validateCreatePostForm(data)
        expect(errors.description).toBeUndefined()
      })
    })

    describe('systemPrompt validation', () => {
      it('should require systemPrompt', () => {
        const data = { ...createValidPostData(), systemPrompt: '' }
        const errors = validateCreatePostForm(data)
        expect(errors.systemPrompt).toBe('システムプロンプトは必須です')
      })

      it('should require non-whitespace systemPrompt', () => {
        const data = { ...createValidPostData(), systemPrompt: '   ' }
        const errors = validateCreatePostForm(data)
        expect(errors.systemPrompt).toBe('システムプロンプトは必須です')
      })
    })

    describe('image validation', () => {
      it('should require image', () => {
        const data = { ...createValidPostData(), pickedImage: null }
        const errors = validateCreatePostForm(data)
        expect(errors.image).toBe('画像をアップロードしてください')
      })
    })

    it('should return multiple errors when multiple fields are invalid', () => {
      const invalidData: CreatePostData = {
        title: '',
        description: '',
        systemPrompt: '',
        pickedImage: null,
      }
      const errors = validateCreatePostForm(invalidData)
      expect(errors.title).toBe('タイトルは必須です')
      expect(errors.description).toBe('説明は必須です')
      expect(errors.systemPrompt).toBe('システムプロンプトは必須です')
      expect(errors.image).toBe('画像をアップロードしてください')
    })
  })

  describe('hasValidationErrors', () => {
    it('should return false for empty errors object', () => {
      expect(hasValidationErrors({})).toBe(false)
    })

    it('should return true when errors exist', () => {
      const errors = { title: 'Title error' }
      expect(hasValidationErrors(errors)).toBe(true)
    })

    it('should return true when multiple errors exist', () => {
      const errors = {
        title: 'Title error',
        description: 'Description error',
      }
      expect(hasValidationErrors(errors)).toBe(true)
    })
  })
})
