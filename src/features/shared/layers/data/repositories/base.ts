/**
 * DATA LAYER - Base Repository Interface
 * Abstract interfaces for data access patterns
 */

import {
  RawDataEnvelope,
  RawPagination,
  RawError,
  DataSource,
} from '../models/base'

// Generic repository interface
export interface BaseRepository<T, K = string> {
  // Basic CRUD operations
  findById(id: K): Promise<RawDataEnvelope<T> | null>
  findMany(filters?: FilterOptions<T>): Promise<RawDataEnvelope<T[]>>
  create(data: Partial<T>): Promise<RawDataEnvelope<T>>
  update(id: K, data: Partial<T>): Promise<RawDataEnvelope<T>>
  delete(id: K): Promise<boolean>

  // Query operations
  findByFilter(filter: FilterOptions<T>): Promise<RawDataEnvelope<T[]>>
  findWithPagination(
    pagination: RawPagination,
    filters?: FilterOptions<T>
  ): Promise<PaginatedResult<T>>
  count(filters?: FilterOptions<T>): Promise<number>

  // Real-time operations
  subscribe(
    id: K,
    callback: (data: RawDataEnvelope<T> | null) => void
  ): () => void
  subscribeToQuery(
    filter: FilterOptions<T>,
    callback: (data: RawDataEnvelope<T[]>) => void
  ): () => void

  // Cache operations
  invalidateCache(id?: K): Promise<void>
  preload(ids: K[]): Promise<void>
}

// Filter options for queries
export interface FilterOptions<T> {
  where?: Array<{
    field: keyof T
    operator: WhereOperator
    value: unknown
  }>
  orderBy?: Array<{
    field: keyof T
    direction: 'asc' | 'desc'
  }>
  limit?: number
  offset?: number
  cursor?: string
}

export type WhereOperator =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'in'
  | 'not-in'
  | 'array-contains'
  | 'array-contains-any'

// Paginated result wrapper
export interface PaginatedResult<T> {
  data: RawDataEnvelope<T[]>
  pagination: {
    hasMore: boolean
    nextCursor?: string
    total?: number
    limit: number
    offset?: number
  }
}

// Repository error handling
export abstract class RepositoryError extends Error {
  abstract readonly code: string
  abstract readonly source: DataSource
  abstract readonly details?: Record<string, unknown>

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }

  toRawError(): RawError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      source: this.source,
      timestamp: new Date(),
    }
  }
}

// Specific error types
export class NotFoundError extends RepositoryError {
  readonly code = 'NOT_FOUND'
  readonly source = DataSource.FIRESTORE

  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`)
  }
}

export class ValidationError extends RepositoryError {
  readonly code = 'VALIDATION_ERROR'
  readonly source = DataSource.FIRESTORE

  constructor(
    message: string,
    public readonly details: Record<string, unknown>
  ) {
    super(message)
  }
}

export class NetworkError extends RepositoryError {
  readonly code = 'NETWORK_ERROR'
  readonly source = DataSource.FIRESTORE

  constructor(message: string) {
    super(message)
  }
}

export class AuthorizationError extends RepositoryError {
  readonly code = 'AUTHORIZATION_ERROR'
  readonly source = DataSource.FIRESTORE

  constructor(resource: string) {
    super(`Access denied to ${resource}`)
  }
}
