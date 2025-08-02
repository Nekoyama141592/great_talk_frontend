import { describe, it, expect } from 'vitest'
import { generateRandomId, generateUUID } from './id-util'

describe('ID Utilities', () => {
  describe('generateRandomId', () => {
    it('should generate a string', () => {
      const id = generateRandomId()
      expect(typeof id).toBe('string')
    })

    it('should generate different IDs each time', () => {
      const id1 = generateRandomId()
      const id2 = generateRandomId()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with expected length', () => {
      const id = generateRandomId()
      // Each Math.random().toString(36).substring(2, 15) generates up to 13 characters
      // So total should be up to 26 characters
      expect(id.length).toBeGreaterThan(0)
      expect(id.length).toBeLessThanOrEqual(26)
    })

    it('should only contain alphanumeric characters', () => {
      const id = generateRandomId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })
  })

  describe('generateUUID', () => {
    it('should generate a valid UUID v4 format', () => {
      const uuid = generateUUID()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(uuid).toMatch(uuidRegex)
    })

    it('should generate different UUIDs each time', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      expect(uuid1).not.toBe(uuid2)
    })

    it('should have the correct length', () => {
      const uuid = generateUUID()
      expect(uuid.length).toBe(36) // 32 hex chars + 4 hyphens
    })

    it('should have hyphens in correct positions', () => {
      const uuid = generateUUID()
      expect(uuid[8]).toBe('-')
      expect(uuid[13]).toBe('-')
      expect(uuid[18]).toBe('-')
      expect(uuid[23]).toBe('-')
    })

    it('should have version 4 indicator', () => {
      const uuid = generateUUID()
      expect(uuid[14]).toBe('4')
    })
  })
})