import { describe, it, expect } from 'vitest'
import { PostDataProcessor } from './post-data-processor'
import { CreatePostData } from '@shared/schema/create-post'

const createMockPostData = (
  overrides?: Partial<CreatePostData>
): CreatePostData => ({
  title: '  Test Title  ',
  description: '  Test description content  ',
  systemPrompt: '  You are a helpful assistant  ',
  pickedImage: new File([''], 'test.jpg', { type: 'image/jpeg' }),
  ...overrides,
})

describe('PostDataProcessor', () => {
  describe('processPostData', () => {
    it('should trim whitespace from all text fields', () => {
      const data = createMockPostData()
      const result = PostDataProcessor.processPostData(data)

      expect(result.title).toBe('Test Title')
      expect(result.description).toBe('Test description content')
      expect(result.systemPrompt).toBe('You are a helpful assistant')
    })

    it('should calculate word count correctly', () => {
      const data = createMockPostData({
        title: 'One Two',
        description: 'Three Four Five',
        systemPrompt: 'Six Seven Eight Nine Ten',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.wordCount).toBe(10)
    })

    it('should handle empty strings in word count', () => {
      const data = createMockPostData({
        title: '',
        description: '',
        systemPrompt: 'Only these words',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.wordCount).toBe(3)
    })

    it('should calculate estimated reading time correctly', () => {
      const data = createMockPostData({
        title: 'a'.repeat(100).split('').join(' '), // 100 words
        description: 'b'.repeat(100).split('').join(' '), // 100 words
        systemPrompt: 'c', // 1 word
      })
      const result = PostDataProcessor.processPostData(data)

      // 201 words / 200 words per minute = 1.005, ceil = 2
      expect(result.estimatedReadingTime).toBe(2)
    })

    it('should detect advanced prompt features - Japanese keywords', () => {
      const data = createMockPostData({
        systemPrompt: 'あなたはロールプレイを行うアシスタントです',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.hasAdvancedPrompt).toBe(true)
    })

    it('should detect advanced prompt features - English keywords', () => {
      const data = createMockPostData({
        systemPrompt: 'You are a roleplay assistant with step-by-step thinking',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.hasAdvancedPrompt).toBe(true)
    })

    it('should detect advanced prompt features - case insensitive', () => {
      const data = createMockPostData({
        systemPrompt: 'Use CHAIN OF THOUGHT reasoning',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.hasAdvancedPrompt).toBe(true)
    })

    it('should not detect advanced features in simple prompts', () => {
      const data = createMockPostData({
        systemPrompt: 'You are a helpful assistant that answers questions',
      })
      const result = PostDataProcessor.processPostData(data)

      expect(result.hasAdvancedPrompt).toBe(false)
    })

    it('should return complete processed data structure', () => {
      const data = createMockPostData()
      const result = PostDataProcessor.processPostData(data)

      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('systemPrompt')
      expect(result).toHaveProperty('wordCount')
      expect(result).toHaveProperty('estimatedReadingTime')
      expect(result).toHaveProperty('hasAdvancedPrompt')
    })
  })

  describe('validateProcessedData', () => {
    it('should warn about content that is too short', () => {
      const processedData = {
        title: 'Hi',
        description: 'Test',
        systemPrompt: 'Help',
        wordCount: 3,
        estimatedReadingTime: 1,
        hasAdvancedPrompt: false,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings).toContain('投稿の内容が短すぎる可能性があります')
    })

    it('should warn about content that is too long', () => {
      const processedData = {
        title: 'Long Title',
        description: 'Long Description',
        systemPrompt: 'Long Prompt',
        wordCount: 1500,
        estimatedReadingTime: 8,
        hasAdvancedPrompt: false,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings).toContain('投稿の内容が長すぎる可能性があります')
    })

    it('should warn about short system prompts without advanced features', () => {
      const processedData = {
        title: 'Good Title',
        description: 'Good Description',
        systemPrompt: 'Short',
        wordCount: 50,
        estimatedReadingTime: 1,
        hasAdvancedPrompt: false,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings).toContain(
        'システムプロンプトをより詳細に記述することを推奨します'
      )
    })

    it('should not warn about short system prompts with advanced features', () => {
      const processedData = {
        title: 'Good Title',
        description: 'Good Description',
        systemPrompt: 'ロールプレイ', // Short but has advanced features
        wordCount: 50,
        estimatedReadingTime: 1,
        hasAdvancedPrompt: true,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings).not.toContain(
        'システムプロンプトをより詳細に記述することを推奨します'
      )
    })

    it('should return empty array for good quality content', () => {
      const processedData = {
        title: 'Perfect Title',
        description: 'Perfect Description with enough content',
        systemPrompt:
          'You are a helpful assistant that provides detailed responses with proper context and examples',
        wordCount: 100,
        estimatedReadingTime: 1,
        hasAdvancedPrompt: false,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings).toEqual([])
    })

    it('should return multiple warnings when multiple issues exist', () => {
      const processedData = {
        title: 'Bad',
        description: 'Bad',
        systemPrompt: 'Bad',
        wordCount: 5,
        estimatedReadingTime: 1,
        hasAdvancedPrompt: false,
      }

      const warnings = PostDataProcessor.validateProcessedData(processedData)
      expect(warnings.length).toBeGreaterThan(1)
      expect(warnings).toContain('投稿の内容が短すぎる可能性があります')
      expect(warnings).toContain(
        'システムプロンプトをより詳細に記述することを推奨します'
      )
    })
  })
})
