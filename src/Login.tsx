import { auth } from "./firebase"
import { GoogleAuthProvider, User, signInWithPopup,onAuthStateChanged,signOut } from "firebase/auth"
import { useEffect, useState } from 'react'

const Login = () => {
    const [user,setUser] = useState<User>();
    const init = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(undefined)
            }
          });
    }
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {}
    };
    const handleLogout = async () => {
        try {
            signOut(auth)
        } catch (error) {}
    }
    useEffect(() => {
        init();
    },[]);
    if (user) {
        return (
            <div>
                <h3>{user?.email ?? ''}</h3>
                <button onClick={handleLogout}>ログアウトする</button>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={handleGoogleLogin}>Googleでログイン</button>
            </div>
        );
    }
    
}
export default Login;