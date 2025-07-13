import { describe, it, expect } from 'vitest'
import { authAtom, uidAtom, firstLoadedAtom, initUserAtom, clearUserAtom } from './index'

describe('Auth Atoms', () => {
  it('should export auth atom', () => {
    expect(authAtom).toBeDefined()
  })

  it('should export derived atoms', () => {
    expect(uidAtom).toBeDefined()
    expect(firstLoadedAtom).toBeDefined()
  })

  it('should export action atoms', () => {
    expect(initUserAtom).toBeDefined()
    expect(clearUserAtom).toBeDefined()
  })
})