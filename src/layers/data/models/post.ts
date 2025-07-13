/**
 * DATA LAYER - Post Models
 * Raw post data as it comes from Firebase/API
 */

import { BaseFirestoreEntity, RawDataEnvelope } from './base'

// Raw AI system prompt data
export interface RawCustomCompleteText {
  systemPrompt: string
  model?: string
  temperature?: number
  maxTokens?: number
  metadata: Record<string, unknown>
}

// Raw detected text data
export interface RawDetectedText {
  value: string
  confidence?: number
  language?: string
  entities?: Array<{
    type: string
    value: string
    confidence: number
  }>
}

// Raw moderated image data
export interface RawModeratedImage {
  bucketName: string
  value: string // file path
  moderationFlags?: string[]
  confidence?: number
  metadata: Record<string, unknown>
}

// Raw post data exactly as stored in Firestore
export interface RawPostData {
  postId: string
  uid: string // author uid
  title: string
  description: string
  customCompleteText: RawCustomCompleteText
  detectedText: RawDetectedText
  moderatedImage: RawModeratedImage
  msgCount: number // interaction count
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  isPinned: boolean
  tags: string[]
  metadata: Record<string, unknown>
}

// Firebase document structure
export interface FirestorePostDocument extends BaseFirestoreEntity {
  data: RawPostData
}

// Raw AI response data
export interface RawAIResponse {
  requestId: string
  postId: string
  userPrompt: string
  aiResponse: string
  model: string
  timestamp: Date
  tokenUsage: {
    prompt: number
    completion: number
    total: number
  }
  metadata: Record<string, unknown>
}

// Raw post interaction data
export interface RawPostInteraction {
  interactionId: string
  postId: string
  uid: string
  type: 'like' | 'bookmark' | 'share' | 'comment'
  timestamp: Date
  metadata: Record<string, unknown>
}

// Post data envelope types
export type PostDataEnvelope = RawDataEnvelope<RawPostData>
export type AIResponseEnvelope = RawDataEnvelope<RawAIResponse>
export type PostInteractionEnvelope = RawDataEnvelope<RawPostInteraction>