import Versions from './components/Versions'
import wishtrackLogo from './assets/logo-wishtrack.png'
import Todo from './components/Todo'
import Header from './components/Header'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <img alt="logo" className="logo" src={wishtrackLogo} />
      <div className="text">Wishtrack</div>
      <Header/>
      <div className="creator">Created by Zyanne</div>
    </>
  )
}

export default App
