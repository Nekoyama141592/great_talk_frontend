import { AuthComponent } from '@auth/components/auth'
import { LoadingComponent } from '@shared/common/loading'
import { useAtomValue } from 'jotai'
import { firstLoadedAtom, uidAtom } from '@auth/atoms'
import { HeaderComponent } from '@shared/common/hearder'
import { ReactNode } from 'react'

interface CheckAuthProps {
  children: ReactNode
}

export const CheckAuthComponent = (props: CheckAuthProps) => {
  const firstLoaded = useAtomValue(firstLoadedAtom)
  const uid = useAtomValue(uidAtom)

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('CheckAuth state:', { firstLoaded, uid })
  }

  if (!firstLoaded) {
    return (
      <>
        <LoadingComponent />
      </>
    )
  }
  if (uid) {
    return (
      <>
        <HeaderComponent />
        {props.children}
      </>
    )
  } else {
    return (
      <>
        <AuthComponent />
      </>
    )
  }
}
