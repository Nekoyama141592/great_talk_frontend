/**
 * DATA LAYER - Base Models
 * Raw data models that represent external data sources exactly as they come
 */

// Base types for all data models
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface BaseFirestoreEntity extends BaseEntity {
  firestorePath: string
  documentId: string
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Raw data envelope for external sources
export interface RawDataEnvelope<T = unknown> {
  data: T
  source: DataSource
  timestamp: Date
  metadata: Record<string, unknown>
}

export enum DataSource {
  FIRESTORE = 'firestore',
  REST_API = 'rest_api',
  LOCAL_STORAGE = 'local_storage',
  CACHE = 'cache',
}

// Raw error structure
export interface RawError {
  code: string
  message: string
  details?: Record<string, unknown>
  source: DataSource
  timestamp: Date
}

// Pagination for raw data
export interface RawPagination {
  limit: number
  offset?: number
  cursor?: string
  hasMore: boolean
  total?: number
}