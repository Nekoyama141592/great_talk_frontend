import DetectedText from './detected-text'
import ModeratedImage from './moderated-image'

interface CustomCompleteText {
  systemPrompt: string
}

export default interface PublicPost {
  customCompleteText: CustomCompleteText
  description: DetectedText
  image: ModeratedImage
  msgCount: number
  postId: string
  title: DetectedText
  uid: string
}
