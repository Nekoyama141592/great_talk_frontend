import CheckAuth from '../../common/check-auth'

const Home = () => {
  return (
    <CheckAuth>
      <h3>人気の投稿</h3>
    </CheckAuth>
  )
}

export default Home
