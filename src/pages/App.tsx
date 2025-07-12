import './App.css'
import { auth } from '../infrastructures/firebase'
import { useSetAtom } from 'jotai'
import { initUserAtom, clearUserAtom } from '../store/atoms'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import Router from './router'

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

  return <Router />
}

function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export default App
