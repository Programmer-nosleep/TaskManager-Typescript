import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRouter from './PrivateRouter';

import Index from "../views/index"
import Login from '../views/auth/Login'
import SignUp from '../views/auth/SignUp'
import DashboardAdmin from '../views/Admin/DashboardAdmin'
import CreateTask from '../views/Admin/CreateTask'
import ManageUser from '../views/Admin/ManageUser'
import ManageTasks from '../views/Admin/MangeTasks'
import DashboardUser from '../views/Users/DashboardUser'
import MyTasks from '../views/Users/MyTasks'
import ViewTaskDetails from '../views/Users/ViewTaskDetails'

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Index /> }/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<SignUp />}></Route>

        <Route element={<PrivateRouter allowedRoles={["admin"]} />} >
          <Route path='/admin/dashboard' element={<DashboardAdmin />}/>
          <Route path='/admin/create-task' element={<CreateTask />}/>
          <Route path='/admin/manage-user' element={<ManageUser />}/>
          <Route path='/admin/manage-task' element={<ManageTasks />}/>
        </Route>

        <Route element={<PrivateRouter allowedRoles={["users"] } />}>
          <Route path='/user/dashboard' element={<DashboardUser />} />
          <Route path='/task' element={<MyTasks />} />
          <Route path='/task-detail/:id' element={<ViewTaskDetails />}/>
          {/* 
            <Route path='/purchase' element={<DashboardUser />} />
            <Route path='/inventory' element={<DashboardUser />} /> 
          */}
        </Route>
      </Routes>
    </Router>
  )
}