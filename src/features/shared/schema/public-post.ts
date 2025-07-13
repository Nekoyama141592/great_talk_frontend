import { CustomCompleteText } from '@shared/schema/custom-complete-text'
import { DetectedText } from '@shared/schema/detected-text'
import { ModeratedImage } from '@shared/schema/moderated-image'
import { Timestamp } from 'firebase/firestore'

export interface PublicPost {
  customCompleteText: CustomCompleteText
  description: DetectedText
  image: ModeratedImage
  msgCount: number
  postId: string
  title: DetectedText
  uid: string
  createdAt: Timestamp
}
