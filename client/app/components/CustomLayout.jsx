"use client";

import { useState } from "react";
import Header from "./Header";
import SiderBar from "./sidebar/SiderBar";

const CustomLayout = ({ children }) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const [isToolTipTrigger, setIsToolTipTrigger] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex bg-white min-h-screen gap-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <SiderBar collapsed={collapsed} toggleSidebar={toggleSidebar} isToolTipTrigger={isToolTipTrigger} />
      <div className={`flex flex-col w-full transition-all duration-300 ease-in-out`}>
        <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 p-4 md:p-6 mt-16 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>{children}</main>
      </div>
    </div>
  );
};

export default CustomLayout;
