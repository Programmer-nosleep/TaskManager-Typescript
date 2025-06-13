import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Button from "./Button";
import SideMenu from "./SideMenu";

interface NavbarProps {
  activeMenu?: string; // optional
}

export default function Navbar({ activeMenu = "" }: NavbarProps) { // default to empty string
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex items-center gap-5 bg-gray-50 border-b border-gray-200/50 backdrop-blur-[2px] py-1 px-7 sticky top-0 z-30">
      <Button
        className="block lg:hidden text-black cursor-pointer"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </Button>

      <h2 className="text-lg font-semibold text-black">Task Manager</h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-gray-50 ">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
      
      <nav className="flex justify-between p-6.5" />
    </div>
  );
}
