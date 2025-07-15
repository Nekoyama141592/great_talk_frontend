import '@testing-library/jest-dom'

// Mock Firebase
vi.mock('@shared/infrastructures/firebase', () => ({
  db: {},
  auth: {
    onAuthStateChanged: vi.fn(callback => {
      // Call callback with mock user
      callback({ uid: 'test-uid' })
      // Return unsubscribe function
      return vi.fn()
    }),
  },
}))

// Mock react-firebase-hooks
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ uid: 'test-uid' }, false, null],
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(_callback => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock React Router
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Mock React Query
vi.mock('@tanstack/react-query', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuery: () => ({
      data: { pages: [] },
      isPending: false,
      error: null,
    }),
    useInfiniteQuery: () => ({
      data: { pages: [] },
      isPending: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    }),
  }
})

// Mock Jotai
vi.mock('jotai', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAtom: (atom: any) => {
      // Handle different atom types based on their toString or properties
      const atomKey = atom.toString?.() || String(atom)

      if (atomKey.includes('authAtom') || atomKey.includes('auth')) {
        return [{ uid: 'test-uid', firstLoaded: false }, vi.fn()]
      }

      if (
        atomKey.includes('postMuteState') ||
        atomKey.includes('PostMute') ||
        atomKey.includes('mute')
      ) {
        return [
          { mutePostTokens: [], muteUserTokens: [], loadingStates: new Map() },
          vi.fn(),
        ]
      }

      // Default return
      return [
        { mutePostTokens: [], muteUserTokens: [], loadingStates: new Map() },
        vi.fn(),
      ]
    },
    useAtomValue: (atom: any) => {
      const atomKey = atom.toString?.() || String(atom)

      if (atomKey.includes('authAtom') || atomKey.includes('auth')) {
        return { uid: 'test-uid', firstLoaded: false }
      }

      if (
        atomKey.includes('postMuteState') ||
        atomKey.includes('PostMute') ||
        atomKey.includes('userMuteState') ||
        atomKey.includes('UserMute') ||
        atomKey.includes('mute')
      ) {
        return {
          mutePostTokens: [],
          muteUserTokens: [],
          loadingStates: new Map(),
        }
      }

      if (atomKey.includes('isPostMuted')) {
        return false
      }

      if (atomKey.includes('isPostMuteLoading')) {
        return false
      }

      return {
        mutePostTokens: [],
        muteUserTokens: [],
        loadingStates: new Map(),
      }
    },
    useSetAtom: () => vi.fn(),
    atom: (init: any) => ({
      read: vi.fn().mockReturnValue(init),
      write: vi.fn(),
      init,
    }),
    Provider: ({ children }: { children: React.ReactNode }) => children,
  }
})
