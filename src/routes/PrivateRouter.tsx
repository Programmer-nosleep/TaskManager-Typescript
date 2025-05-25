import React from 'react'
import { Outlet } from 'react-router-dom'

interface ProtectedRouterProps {
  allowedRoles: string[]
}

export default function PrivateRouter({allowedRoles}: ProtectedRouterProps) {
  return Outlet
}