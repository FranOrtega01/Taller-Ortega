import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import "./styles.css"
import Layout from '../components/common/layout'

const App = () => {
  return (
    <Layout>

      <Sidebar />
      <Layout.Main>
        <Outlet />
      </Layout.Main>
    </Layout>
  )
}

export default App
