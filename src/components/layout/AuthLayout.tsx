import React from "react";
// import UI_IMAGE from "../../assets/images";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-semibold text-black">Task Maneger</h2>
          { children }
      </div>

      <div className="hidden p-8 md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden"> 
        {/* <img src="{UI_IMAGE}" alt="" className="w-64 lg:w-[90%]" /> */}
      </div>
    </div>
  );
}
