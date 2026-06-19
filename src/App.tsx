import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import RecruitDetail from '@/pages/RecruitDetail'
import Profile from '@/pages/Profile'
import ProfileEdit from '@/pages/ProfileEdit'
import CreateRecruitment from '@/pages/CreateRecruitment'

function LayoutWrapper() {
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith('/profile/edit') || pathname.startsWith('/create') || pathname.startsWith('/recruit/')

  return hideNav ? (
    <Outlet />
  ) : (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/recruit/:id" element={<RecruitDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/create" element={<CreateRecruitment />} />
        </Route>
      </Routes>
    </Router>
  )
}
