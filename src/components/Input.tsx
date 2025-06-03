import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, type = "text", ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      {label && <label className="text-sm text-slate-800 block mb-1">{label}</label>}
      <div className="input-box flex items-center border px-2 py-1 rounded">
        <input
          type={actualType}
          className="w-full bg-transparent outline-none"
          {...props}
        />
        {isPasswordType && (
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer ml-2">
            {showPassword ? (
              <FaRegEye size={20} className="text-primary" />
            ) : (
              <FaRegEyeSlash size={20} className="text-slate-400" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
