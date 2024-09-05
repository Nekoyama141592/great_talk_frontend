import { auth } from "../../infrastructures/firebase"
import { useSelector } from "react-redux"
import { signOut } from "firebase/auth";

const Home = () => {
    const email = useSelector((state: any) => state.authReducer.email);
    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {}
    }
    
    return (
        <div>
            <h3>{email}</h3>
            <button onClick={handleLogout}>ログアウトする</button>
        </div>
    )
}

export default Home;