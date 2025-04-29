import { Route } from 'react-router-dom'
import Home from './pages/home/Home'

const jobsRoutes = (
  <>
    <Route index element={<Home />} />
  </>
)

export default jobsRoutes
