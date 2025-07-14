import { useAtom } from 'jotai'
import { ApiRepository } from '@shared/repositories/api-repository'
import {
  imageGenerationAtom,
  updatePromptAtom,
  updateSizeAtom,
  setLoadingAtom,
  setGeneratedImageAtom,
  setErrorAtom,
  resetImageGenerationAtom,
} from '../atoms'

const apiRepository = new ApiRepository()

export const useImageGeneration = () => {
  const [state] = useAtom(imageGenerationAtom)
  const [, updatePrompt] = useAtom(updatePromptAtom)
  const [, updateSize] = useAtom(updateSizeAtom)
  const [, setLoading] = useAtom(setLoadingAtom)
  const [, setGeneratedImage] = useAtom(setGeneratedImageAtom)
  const [, setError] = useAtom(setErrorAtom)
  const [, resetState] = useAtom(resetImageGenerationAtom)

  const generateImage = async () => {
    if (!state.prompt.trim()) {
      setError('プロンプトを入力してください')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await apiRepository.generateImage(state.prompt, state.size)
      
      if (result.success && result.data) {
        setGeneratedImage(result.data.base64)
      } else {
        setError(result.error || '画像の生成に失敗しました')
      }
    } catch {
      setError('画像の生成中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return {
    state,
    updatePrompt,
    updateSize,
    generateImage,
    setError,
    resetState,
  }
}