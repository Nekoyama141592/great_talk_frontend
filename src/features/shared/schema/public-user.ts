import { DetectedText } from '@shared/schema/detected-text'
import { ModeratedImage } from '@shared/schema/moderated-image'

export interface PublicUser {
  bio: DetectedText
  blockCount: number
  ethAddress: string
  followerCount: number
  followingCount: number
  isNFTicon: boolean
  isOfficial: boolean
  isSuspended: boolean
  muteCount: number
  postCount: number
  reportCount: number
  uid: string
  image: ModeratedImage
  userName: DetectedText
}
