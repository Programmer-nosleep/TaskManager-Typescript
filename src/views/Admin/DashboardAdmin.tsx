import React, { useContext } from 'react'
import { UseUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function DashboardAdmin() {
  UseUserAuth();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("dahboard admin must be used with UserProvider");
  }

  const { user } = context;
  return (
    <DashboardLayout>
      <h2>Hello,World!</h2>
    </DashboardLayout>
  )
}