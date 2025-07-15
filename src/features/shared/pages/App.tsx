import './App.css'
import { auth } from '@shared/infrastructures/firebase'
import { useSetAtom } from 'jotai'
import { initUserAtom, clearUserAtom } from '@atoms'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { lightTheme } from '../theme/modern-theme'
import { RouterComponent } from '@shared/pages/router'
import { useLikedPosts } from '../../posts/hooks/use-liked-posts'

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

// For now using light theme, can add dark mode toggle later
const theme = lightTheme
const AppContent = () => {
  const initUser = useSetAtom(initUserAtom)
  const clearUser = useSetAtom(clearUserAtom)

  // Initialize liked posts state when user is authenticated
  useLikedPosts()

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterComponent />
    </ThemeProvider>
  )
}

export const AppComponent = () => {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </JotaiProvider>
  )
}
