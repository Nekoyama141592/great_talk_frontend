import '@testing-library/jest-dom'

// Mock Firebase
vi.mock('@shared/infrastructures/firebase', () => ({
  db: {},
  auth: {},
}))

// Mock React Router
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Mock React Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuery: () => ({
      data: [],
      isPending: false,
      error: null,
    }),
  }
})

// Mock Jotai
vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAtomValue: () => 'test-uid',
    useSetAtom: () => vi.fn(),
    atom: () => ({ init: { uid: '', firstLoaded: false } }),
    Provider: ({ children }: { children: React.ReactNode }) => children,
  }
})