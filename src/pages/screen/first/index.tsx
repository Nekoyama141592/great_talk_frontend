import Auth from '../auth';
import Home from '../home';
import Loading from '../loading';
import { useSelector } from "../../../store";
function First() { 
  const firstLoaded = useSelector((state) => state.authReducer.firstLoaded);
  const uid = useSelector((state) => state.authReducer.uid);

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
