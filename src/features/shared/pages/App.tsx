import './App.css'
import { auth } from '@shared/infrastructures/firebase'
import { useSetAtom } from 'jotai'
import { initUserAtom, clearUserAtom } from '@atoms'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { RouterComponent } from '@shared/pages/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})
function AppContent() {
  const initUser = useSetAtom(initUserAtom)
  const clearUser = useSetAtom(clearUserAtom)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting up auth listener...')
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'Auth state changed:',
          user ? `User: ${user.uid}` : 'No user'
        )
      }

      if (user) {
        const { uid } = user
        initUser({ uid })
      } else {
        clearUser()
      }
    })

    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleaning up auth listener')
      }
      unsubscribe()
    }
  }, [initUser, clearUser])

  return <RouterComponent />
}

export function AppComponent() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </JotaiProvider>
  )
}
