import './App.css'
import Login from './Login';
import { Provider } from 'react-redux'
import store from './store'
function App() { 
  return (
    <>
      <Provider store={store}>
        <Login></Login>
      </Provider>
    </>
  )
}

export default App
