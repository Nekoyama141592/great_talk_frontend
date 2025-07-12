import Auth from '../auth'
import Loading from '../loading'
import { useAtomValue } from 'jotai'
import { firstLoadedAtom, uidAtom } from '../../store/atoms'
import Header from '../hearder'
import { ReactNode } from 'react'

interface CheckAuthProps {
  children: ReactNode
}

const CheckAuth = (props: CheckAuthProps) => {
  const firstLoaded = useAtomValue(firstLoadedAtom)
  const uid = useAtomValue(uidAtom)

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('CheckAuth state:', { firstLoaded, uid })
  }

  if (!firstLoaded) {
    return (
      <>
        <Loading />
      </>
    )
  }
  if (uid) {
    return (
      <>
        <Header />
        {props.children}
      </>
    )
  } else {
    return (
      <>
        <Auth />
      </>
    )
  }
}

export default CheckAuth
