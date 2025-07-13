import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@shared/infrastructures/firebase'
import { PostRepository } from '../repositories/post-repository'
import { CreatePostRequest } from '@shared/schema/create-post'

interface UseCreatePostResult {
  createPost: (postData: CreatePostRequest) => Promise<void>
  isLoading: boolean
  error: string | null
}

export const useCreatePost = (): UseCreatePostResult => {
  const [user] = useAuthState(auth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const repository = new PostRepository()

  const createPost = async (postData: CreatePostRequest) => {
    if (!user) {
      setError('ログインが必要です')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await repository.createPost(user.uid, postData)
    } catch {
      setError('投稿の作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createPost,
    isLoading,
    error
  }
}