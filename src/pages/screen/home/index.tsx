import { auth } from "../../../infrastructures/firebase"
import { useSelector } from "react-redux"
import { signOut } from "firebase/auth";

const Home = () => {
    const uid = useSelector((state: any) => state.authReducer.uid);
    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {}
    }
    
    return (
        <div>
            <h3>{uid}</h3>
            <button onClick={handleLogout}>ログアウトする</button>
        </div>
    )
}

export default Home;