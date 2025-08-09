import { DetectedText } from '@shared/schema/detected-text'
import { ModeratedImage } from '@shared/schema/moderated-image'

export interface PublicUser {
  bio: DetectedText
  ethAddress: string
  followerCount: number
  followingCount: number
  isNFTicon: boolean
  isOfficial: boolean
  isSuspended: boolean
  muteCount: number
  postCount: number
  uid: string
  image: ModeratedImage
  userName: DetectedText
}
