"use client";

import { useState } from "react";
import Header from "./Header";
import SiderBar from "./SiderBar";

const CustomLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex bg-gray-100">
      <div className="flex flex-col w-full lg:ml-64">
        <Header toggleSidebar={toggleSidebar}/>
        <main className="flex-1 p-2 md:p-6 mt-18 min-h-screen md:ml-10">
          {children}
        </main>
        <SiderBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default CustomLayout;
