import { auth } from "./firebase"
import { useDispatch,useSelector } from "react-redux"
import { GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut } from "firebase/auth"
import { useEffect } from 'react'
import { initUser,clearUser } from "./reducers"
const Login = () => {
    const email = useSelector((state: any) => state.authReducer.email);
    const dispatch = useDispatch();
    const init = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email ?? ''
                const payload = {email}
                const action = initUser(payload);
                dispatch(action);
            } else {
                const payload = {email: ''}
                const action = clearUser(payload);
                dispatch(action);
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
    if (email) {
        return (
            <div>
                <h3>{email}</h3>
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