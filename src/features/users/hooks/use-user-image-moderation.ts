import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@shared/infrastructures/firebase'

export const useUserImageModeration = (uid: string | null) => {
  return useQuery({
    queryKey: ['userImageModeration', uid],
    queryFn: async () => {
      if (!uid) return null

      const docRef = doc(db, 'public/v1/users', uid)
      const userDoc = await getDoc(docRef)
      const data = userDoc.data()

      if (!data) return null

      return {
        hasModeratedImage: !!data.image?.moderationModelVersion,
        uid: uid,
      }
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
