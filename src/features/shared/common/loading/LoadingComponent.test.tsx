import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingComponent } from './index'

describe('LoadingComponent', () => {
  it('renders the loading text', () => {
    render(<LoadingComponent />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('has the correct structure', () => {
    render(<LoadingComponent />)

    const loadingElement = screen.getByText('Loading...')
    expect(loadingElement.tagName).toBe('H3')
  })
})
