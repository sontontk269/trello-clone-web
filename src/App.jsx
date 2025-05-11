import Board from './pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { NotFound } from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVertification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/settings/Settings'
import Boards from '~/pages/Boards'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />

  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="boards" replace={true} />} />

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      <Route path="/account/verification" element={<AccountVerification />} />

      {/***404 not found***/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
