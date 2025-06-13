import React, { useState, useContext, useEffect } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import moment  from 'moment';

import axiosInstance from '../../utils/axiosInstance';
import DashboardLayout from '../../components/layout/DashboardLayout';
import InfoCard from '../../components/Cards/InfoCard';

import { addThousandsSeparator } from '../../utils/helper';
import { UseUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/ApiPaths';

interface DashboardData {
  charts: {
    taskDistribution: Record<string, number>; 
    [key: string]: any;
  };
  [key: string]: any;
}

export default function DashboardAdmin() {
  UseUserAuth();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("DashboardAdmin must be used with UserProvider");
  }

  const { user } = context;

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const taskData = dashboardData?.charts?.taskDistribution || {};

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );

      if (response.data) setDashboardData(response.data);

    } catch (err: any) {
      console.error(`Error fetching users: ${err}`);
    }
  };

  useEffect(() => {
    getDashboardData();

    return () => {

    };
  }, []);


  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className='card my-5'>
        <div className=''>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl font-semibold'>Good Morning! {user?.name}</h2>
            <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
              {moment().format("dddd Do MMM YYYY")}
            </p>

          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard
            icon={<FiCheckSquare size={20} className="text-white" />}
            label="Pending Tasks"
            value={addThousandsSeparator(taskData.Pending || 0)}
            color="bg-yellow-500"
          />
          <InfoCard
            icon={<FiCheckSquare size={20} className="text-white" />}
            label="In Progress Tasks"
            value={addThousandsSeparator(taskData.InProgress || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<FiCheckSquare size={20} className="text-white" />}
            label="Completed Tasks"
            value={addThousandsSeparator(taskData.Completed || 0)}
            color="bg-green-500"
          />
          <InfoCard
            icon={<FiCheckSquare size={20} className="text-white" />}
            label="Total Tasks"
            value={addThousandsSeparator(taskData.All || 0)}
            color="bg-blue-500"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}