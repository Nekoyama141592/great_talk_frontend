export interface CreatePostData {
  title: string
  systemPrompt: string
  description: string
  pickedImage?: string | null
}

export interface CreatePostRequest {
  title: string
  systemPrompt: string
  description: string
  image: File | string
}