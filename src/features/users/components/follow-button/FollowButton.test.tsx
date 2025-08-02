import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FollowButton } from './index'

// Mock dependencies
const mockToggleFollow = vi.fn()
const mockIsFollowing = vi.fn()
const mockIsLoadingFollowAction = vi.fn()

vi.mock('../../hooks/use-follow', () => ({
  useFollow: () => ({
    toggleFollow: mockToggleFollow,
    isFollowing: mockIsFollowing,
    isLoadingFollowAction: mockIsLoadingFollowAction,
  }),
}))

const defaultProps = {
  targetUserId: 'target-user-id',
}

describe('FollowButton', () => {
  beforeEach(() => {
    mockIsFollowing.mockReturnValue(false)
    mockIsLoadingFollowAction.mockReturnValue(false)
    mockToggleFollow.mockClear()
  })

  it('should render follow button when not following', () => {
    render(<FollowButton {...defaultProps} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('フォロー')).toBeInTheDocument()
  })

  it('should render unfollow button when following', () => {
    mockIsFollowing.mockReturnValue(true)

    render(<FollowButton {...defaultProps} />)

    expect(screen.getByText('アンフォロー')).toBeInTheDocument()
  })

  it('should handle different variants', () => {
    const { rerender } = render(
      <FollowButton {...defaultProps} variant='outlined' />
    )
    expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined')

    rerender(<FollowButton {...defaultProps} variant='text' />)
    expect(screen.getByRole('button')).toHaveClass('MuiButton-text')
  })

  it('should handle different sizes', () => {
    const { rerender } = render(<FollowButton {...defaultProps} size='small' />)
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeSmall')

    rerender(<FollowButton {...defaultProps} size='large' />)
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeLarge')
  })

  it('should be full width when specified', () => {
    render(<FollowButton {...defaultProps} fullWidth />)

    expect(screen.getByRole('button')).toHaveClass('MuiButton-fullWidth')
  })

  it('should show loading state when processing', () => {
    mockIsLoadingFollowAction.mockReturnValue(true)

    render(<FollowButton {...defaultProps} />)

    expect(screen.getByText('処理中...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
