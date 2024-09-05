import Auth from '../auth';
import Home from '../home';
import Loading from '../loading';
import { auth } from "../../../infrastructures/firebase"
import { useDispatch,useSelector } from "react-redux"
import { initUser,clearUser } from "../../../reducers"
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect} from 'react'
function First() { 
  const firstLoaded = useSelector((state: any) => state.authReducer.firstLoaded);
  const email = useSelector((state: any) => state.authReducer.email);
  const dispatch = useDispatch();
  
  const init = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const {email,uid} = user;
            const payload = {email,uid}
            const action = initUser(payload);
            dispatch(action);
        } else {
            const payload = {};
            const action = clearUser(payload);
            dispatch(action);
        }
      });
  }
  useEffect(() => {
    init();
  },[]);
  if (!firstLoaded) {
    return <Loading></Loading>
  }
  if (email) {
    return <Home></Home>
  } else {
    return <Auth></Auth>
  }
}

export default First