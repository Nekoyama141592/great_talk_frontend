import Auth from '../auth'
import Loading from '../loading'
import { useSelector } from '../../store'
import Header from '../hearder'

const CheckAuth = (props: any) => {
  const firstLoaded = useSelector((state) => state.authReducer.firstLoaded)
  const uid = useSelector((state) => state.authReducer.uid)

  if (!firstLoaded) {
    return (
      <>
        <Loading />
      </>
    )
  }
  if (uid) {
    return (
      <>
        <Header />
        {props.children}
      </>
    )
  } else {
    return (
      <>
        <Auth />
      </>
    )
  }
}

export default CheckAuth
