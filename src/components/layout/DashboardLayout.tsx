import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";

import Navbar from "../Navbar";
import SideMenu from "../SideMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
}

export default function DashboardLayout({ children, activeMenu = "" }: DashboardLayoutProps) {
  const context = useContext(UserContext);
  if (!context) throw new Error("Dashboard layout error: UserContext not found");

  const { user } = context;

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
