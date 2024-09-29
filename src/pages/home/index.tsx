import { useSelector } from '../../store'
import CheckAuth from '../../common/check-auth'

const Home = () => {
  const uid = useSelector((state) => state.authReducer.uid)

  return (
    <CheckAuth>
      <h3>人気の投稿</h3>
    </CheckAuth>
  )
}

export default Home
