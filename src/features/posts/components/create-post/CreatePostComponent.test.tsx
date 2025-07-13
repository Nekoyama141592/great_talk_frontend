import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreatePostComponent } from './index'

describe('CreatePostComponent', () => {
  it('renders the create post heading', () => {
    render(<CreatePostComponent />)
    
    expect(screen.getByText('Create Post')).toBeInTheDocument()
  })

  it('has the correct tag structure', () => {
    render(<CreatePostComponent />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Create Post')
  })
})