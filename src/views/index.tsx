import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const handleButton = () => {
    navigate("/login");
  }

  return (
    <div className="flex justify-center items-center h-screen"> {/* Tambah h-screen */}
      <div className="w-[90%] lg:w-[70%] flex flex-col justify-center items-center space-y-4"> {/* Tambah items-center dan space-y */}
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <Button onClick={handleButton}>
          Login
        </Button>
      </div>
    </div>
  );
}
