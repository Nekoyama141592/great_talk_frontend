import { CustomCompleteText } from '@shared/schema/custom-complete-text'
import { DetectedText } from '@shared/schema/detected-text'
import { ModeratedImage } from '@shared/schema/moderated-image'

export interface PublicPost {
  customCompleteText: CustomCompleteText
  description: DetectedText
  image: ModeratedImage
  msgCount: number
  postId: string
  title: DetectedText
  uid: string
}
