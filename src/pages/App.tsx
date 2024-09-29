import './App.css'
import { auth } from '../infrastructures/firebase'
import { useDispatch } from 'react-redux'
import { initUser, clearUser } from '../reducers/authReducer'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
function App() {
  const dispatch = useDispatch()
  const init = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user
        const payload = { uid }
        const action = initUser(payload)
        dispatch(action)
      } else {
        const payload = {}
        const action = clearUser(payload)
        dispatch(action)
      }
    })
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  )
}

export default App
