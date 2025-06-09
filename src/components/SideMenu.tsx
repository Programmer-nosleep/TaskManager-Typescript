import React from "react";
import { Link } from "react-router-dom";

interface SideMenuProps {
  activeMenu: string;
}

const menuItems = [
  { label: "Dashboard", path: "/dashboard", id: "dashboard" },
  { label: "Users", path: "/users", id: "users" },
  { label: "Settings", path: "/settings", id: "settings" },
];

export default function SideMenu({ activeMenu }: SideMenuProps) {
  return (
    <div className="w-64 h-full bg-gray-100 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded transition ${
                activeMenu === item.id
                  ? "bg-blue-200 text-blue-600 font-semibold"
                  : "text-gray-800 hover:bg-blue-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
