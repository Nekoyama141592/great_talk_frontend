import { atom } from 'jotai'

export interface ImageGenerationState {
  prompt: string
  size: '1024x1024' | '1536x1024' | '1024x1536'
  generatedImage: string | null
  isLoading: boolean
  error: string | null
}

export const imageGenerationAtom = atom<ImageGenerationState>({
  prompt: '',
  size: '1024x1024',
  generatedImage: null,
  isLoading: false,
  error: null,
})

export const updatePromptAtom = atom(
  null,
  (get, set, prompt: string) => {
    const current = get(imageGenerationAtom)
    set(imageGenerationAtom, { ...current, prompt })
  }
)

export const updateSizeAtom = atom(
  null,
  (get, set, size: '1024x1024' | '1536x1024' | '1024x1536') => {
    const current = get(imageGenerationAtom)
    set(imageGenerationAtom, { ...current, size })
  }
)

export const setLoadingAtom = atom(
  null,
  (get, set, isLoading: boolean) => {
    const current = get(imageGenerationAtom)
    set(imageGenerationAtom, { ...current, isLoading })
  }
)

export const setGeneratedImageAtom = atom(
  null,
  (get, set, generatedImage: string | null) => {
    const current = get(imageGenerationAtom)
    set(imageGenerationAtom, { ...current, generatedImage })
  }
)

export const setErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    const current = get(imageGenerationAtom)
    set(imageGenerationAtom, { ...current, error })
  }
)

export const resetImageGenerationAtom = atom(
  null,
  (_get, set) => {
    set(imageGenerationAtom, {
      prompt: '',
      size: '1024x1024',
      generatedImage: null,
      isLoading: false,
      error: null,
    })
  }
)