import Auth from '../auth';
import Home from '../home';
import Loading from '../loading';
import { useSelector } from "react-redux"
function First() { 
  const firstLoaded = useSelector((state: any) => state.authReducer.firstLoaded);
  const uid = useSelector((state: any) => state.authReducer.uid);

  if (!firstLoaded) {
    return <Loading></Loading>
  }
  if (uid) {
    return <Home></Home>
  } else {
    return <Auth></Auth>
  }
}

export default First
