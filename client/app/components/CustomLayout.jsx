"use client";

import { useState } from "react";
import Header from "./Header";
import SiderBar from "./sidebar/SiderBar";

const CustomLayout = ({ children }) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const [isToolTipTrigger, setIsToolTipTrigger] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex bg-gray-100 min-h-screen gap-6">
      <SiderBar collapsed={collapsed} toggleSidebar={toggleSidebar} isToolTipTrigger={isToolTipTrigger} />
      <div className={`flex flex-col w-full transition-all duration-300 ease-in-out`}>
        <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 p-4 md:p-6 mt-16 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 ease-in-out`}>{children}</main>
      </div>
    </div>
  );
};

export default CustomLayout;
