import React, { useState, useContext, useEffect } from 'react'

import axiosInstance from '../../utils/axiosInstance';
import DashboardLayout from '../../components/layout/DashboardLayout';

import { UseUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/ApiPaths';

export default function DashboardAdmin() {
  UseUserAuth();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("DashboardAdmin must be used with UserProvider");
  }

  const { user } = context;

  const navigate = useNavigate();
  const [dashboarData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );

      if (response.data) setDashboardData(response.data);

    } catch (err: any) {
      console.error(`Error fetching users: ${err}`);
    }
  }

  useEffect(() => {
    getDashboardData();

    return () => {

    };
  }, [])

  return (
    <DashboardLayout activeMenu='Dashboard'>
      <h2>Hello,World!</h2>
    </DashboardLayout>
  )
}