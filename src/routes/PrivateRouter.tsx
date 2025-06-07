import { Outlet, Navigate } from 'react-router-dom'

interface ProtectedRouterProps {
  allowedRoles: string[]
}

export default function PrivateRouter({ allowedRoles }: ProtectedRouterProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null")

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
