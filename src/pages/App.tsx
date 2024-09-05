import './App.css'
import First from './screen/first';
import { auth } from "../infrastructures/firebase"
import { useDispatch } from "react-redux"
import { initUser,clearUser } from "../reducers"
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect} from 'react'

function App() {
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
  return (
    <>
      <First></First>
    </>
  )
}

export default App
