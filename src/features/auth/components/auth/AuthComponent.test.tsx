import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthComponent } from './index'

// Mock Firebase Auth
vi.mock('@shared/infrastructures/firebase', () => ({
  auth: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}))

describe('AuthComponent', () => {
  it('renders google sign in button', () => {
    render(<AuthComponent />)
    
    expect(screen.getByText('Googleでログイン')).toBeInTheDocument()
  })

  it('has a clickable button', () => {
    render(<AuthComponent />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Googleでログイン')
  })
})