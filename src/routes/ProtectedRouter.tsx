import React from 'react'
import { Outlet } from 'react-router-dom'


interface ProtectedRouterProps {
  allowedRoles: string[]
}

export default function ProtectedRouter({allowedRoles}: ProtectedRouterProps) {
  return Outlet
}