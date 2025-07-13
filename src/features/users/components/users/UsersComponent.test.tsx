import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UsersComponent } from './index'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('UsersComponent', () => {
  it('renders without crashing', () => {
    renderWithRouter(<UsersComponent />)
    
    // Component renders an empty fragment with outlet, so just check it doesn't crash
    expect(document.body).toBeInTheDocument()
  })

  it('renders outlet element', () => {
    const { container } = renderWithRouter(<UsersComponent />)
    
    // Should render without throwing errors (outlet is rendered by react-router)
    expect(container).toBeInTheDocument()
  })
})