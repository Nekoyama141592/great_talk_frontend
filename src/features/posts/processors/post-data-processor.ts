import { CreatePostData } from '@shared/schema/create-post'

export interface ProcessedPostData {
  title: string
  systemPrompt: string
  description: string
  wordCount: number
  estimatedReadingTime: number
  hasAdvancedPrompt: boolean
}

export class PostDataProcessor {
  /**
   * Process and enrich create post data with additional information
   */
  static processPostData(data: CreatePostData): ProcessedPostData {
    const title = data.title.trim()
    const description = data.description.trim()
    const systemPrompt = data.systemPrompt.trim()

    // Calculate word count
    const wordCount = this.calculateWordCount(title, description, systemPrompt)

    // Estimate reading time (average 200 words per minute)
    const estimatedReadingTime = Math.ceil(wordCount / 200)

    // Check if system prompt contains advanced features
    const hasAdvancedPrompt = this.detectAdvancedPrompt(systemPrompt)

    return {
      title,
      systemPrompt,
      description,
      wordCount,
      estimatedReadingTime,
      hasAdvancedPrompt,
    }
  }

  /**
   * Calculate total word count from all text fields
   */
  private static calculateWordCount(...texts: string[]): number {
    return texts
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 0).length
  }

  /**
   * Detect if system prompt contains advanced AI features
   */
  private static detectAdvancedPrompt(systemPrompt: string): boolean {
    const advancedKeywords = [
      'ロールプレイ',
      'roleplay',
      'persona',
      'character',
      'ステップバイステップ',
      'step-by-step',
      'chain of thought',
      'few-shot',
      'example',
      '例',
      '具体例',
    ]

    const lowerCasePrompt = systemPrompt.toLowerCase()
    return advancedKeywords.some(keyword =>
      lowerCasePrompt.includes(keyword.toLowerCase())
    )
  }

  /**
   * Validate processed data meets quality standards
   */
  static validateProcessedData(processed: ProcessedPostData): string[] {
    const warnings: string[] = []

    if (processed.wordCount < 10) {
      warnings.push('投稿の内容が短すぎる可能性があります')
    }

    if (processed.wordCount > 1000) {
      warnings.push('投稿の内容が長すぎる可能性があります')
    }

    if (!processed.hasAdvancedPrompt && processed.systemPrompt.length < 50) {
      warnings.push('システムプロンプトをより詳細に記述することを推奨します')
    }

    return warnings
  }
}
