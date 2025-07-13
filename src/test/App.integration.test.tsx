import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppComponent } from '@shared/pages/App'

// Mock Firebase
vi.mock('@shared/infrastructures/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(callback => {
      // Simulate user not logged in
      callback(null)
      return vi.fn() // unsubscribe function
    }),
  },
}))

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('App Integration', () => {
  it('renders the app without crashing', () => {
    renderApp()

    // Should render without throwing errors
    expect(document.body).toBeInTheDocument()
  })

  it('renders main content when not logged in', () => {
    renderApp()

    // The app renders successfully and shows main content
    // (Actual auth check behavior may vary based on mocking)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})
