import CustomCompleteText from './custom-complete-text'
import DetectedText from './detected-text'
import ModeratedImage from './moderated-image'

export default interface PublicPost {
  customCompleteText: CustomCompleteText
  description: DetectedText
  image: ModeratedImage
  msgCount: number
  postId: string
  title: DetectedText
  uid: string
}
