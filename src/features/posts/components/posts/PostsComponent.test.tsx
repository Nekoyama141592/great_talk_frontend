import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostsComponent } from './index'

// Mock Firebase
vi.mock('@shared/infrastructures/firebase', () => ({
  db: {},
}))

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collectionGroup: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
}))

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('PostsComponent', () => {
  it('renders empty posts list when no data', () => {
    renderWithProviders(<PostsComponent />)

    // Should render ul element
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})
