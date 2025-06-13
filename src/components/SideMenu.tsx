import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";

import { UserContext } from "../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../utils/data";

interface SideMenuProps {
  activeMenu: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export default function SideMenu({ activeMenu }: SideMenuProps) {
  const context = useContext(UserContext);
  if (!context) throw new Error("SideMenu must be used with UserProvider");

  const { user, clearUser } = context;
  const [sideMenuData, setSideMenuData] = useState<MenuItem[]>([]);

  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative p-5">
          <img
            src={user?.profileImgUrl || ""}
            alt="Profile"
            className="w-20 h-20 rounded-full bg-slate-400 object-cover"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-blue-600 px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      <div className="flex flex-col">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 text-left transition ${
              activeMenu === item.label
                ? "text-blue-600 bg-gradient-to-t from-blue-50/40 to-blue-100/50 border-r-[3px] border-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            } cursor-pointer`}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
