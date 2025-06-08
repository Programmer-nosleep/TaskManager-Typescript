// import { Outlet, Navigate } from 'react-router-dom'

// interface ProtectedRouterProps {
//   allowedRoles: string[]
// }

// export default function PrivateRouter({ allowedRoles }: ProtectedRouterProps) {
//   const user = JSON.parse(localStorage.getItem("user") || "null")

//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />
//   }

//   return <Outlet />
// }

import React from 'react'
import { Outlet } from 'react-router-dom'

interface ProtectedRouterProps {
  allowedRoles: string[]
}

export default function PrivateRouter({ allowedRoles }: ProtectedRouterProps) {
  return <Outlet />
}

// import React from 'react'
// import { Outlet, Navigate } from 'react-router-dom'

// interface ProtectedRouterProps {
//   allowedRoles: string[]
// }

// export default function PrivateRouter({ allowedRoles }: ProtectedRouterProps) {
//   // Misalnya Anda punya cara untuk mengambil peran user yang sedang login
//   const userRole = localStorage.getItem('role') // Contoh, bisa diganti dengan context/auth state

//   if (!userRole || !allowedRoles.includes(userRole)) {
//     return <Navigate to="/login" replace />
//   }

//   return <Outlet />
// }
