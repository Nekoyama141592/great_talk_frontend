import { auth } from '../../infrastructures/firebase'

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const Auth = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>Googleでログイン</button>
    </div>
  )
}
export default Auth
