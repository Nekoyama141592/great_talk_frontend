import { auth } from "../../infrastructures/firebase"
import { useSelector } from "../../store";
import { signOut } from "firebase/auth";
import CheckAuth from "../../common/check-auth";

const Home = () => {
    const uid = useSelector((state) => state.authReducer.uid);
    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {}
    }
    
    return (
        <CheckAuth>
            <div>
                <h3>{uid}</h3>
                <button onClick={handleLogout}>ログアウトする</button>
            </div>
        </CheckAuth>
    )
}

export default Home;