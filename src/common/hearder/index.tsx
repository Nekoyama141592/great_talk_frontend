import { Link } from 'react-router-dom'
import { useSelector } from '../../store'
import { signOut } from 'firebase/auth'
import { auth } from '../../infrastructures/firebase'
import { useState } from 'react'
import { TiThMenu } from 'react-icons/ti'
const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const uid = useSelector((state) => state.authReducer.uid)
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {}
  }

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open)
  }

  return (
    <header>
      <div className="relative">
        <div className="fixed top-0 left-0 p-2 text-white z-50">
          <button onClick={() => toggleDrawer(true)}>
            <TiThMenu></TiThMenu>
          </button>
        </div>
        {drawerOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50">
              <button
                onClick={() => toggleDrawer(false)}
                className="mt-10 p-2 bg-red-500 text-white"
              >
                閉じる
              </button>
              <nav className="mt-10">
                <ul>
                  <li className="p-2 text-black">
                    <h3>{uid.slice(0, 5)}...でログイン中</h3>
                  </li>
                  <li className="p-2">
                    <Link to="/" className="text-blue-500">
                      ホーム
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/createPost" className="text-blue-500">
                      投稿を作成
                    </Link>
                  </li>
                  {uid && (
                    <li className="p-2">
                      <button onClick={handleLogout} className="text-white">
                        ログアウト
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
