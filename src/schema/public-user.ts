import DetectedText from './detected-text'
import ModeratedImage from './moderated-image'

export default interface PublicUser {
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
