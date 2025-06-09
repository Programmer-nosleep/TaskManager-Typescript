import React from 'react'
import { UseUserAuth } from '../../hooks/useUserAuth'

export default function DashboardUser() {
  UseUserAuth();
  return (
    <div>
      <h1>Dashboard User</h1>
    </div>
  )
}