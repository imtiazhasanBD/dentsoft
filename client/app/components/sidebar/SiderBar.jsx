"use client";
import {
  LogOut,
  X,
  Home,
  Calendar,
  Users,
  FileText,
  PieChart,
  LayoutTemplate,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import NavItem from "./NavItem";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { logoutUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Appointments", path: "/appointment-dashboard" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: FileText, label: "Invoices", path: "/invoices" },
    { icon: PieChart, label: "Expenses", path: "/expenses" },
    { icon: LayoutTemplate, label: "Templates", path: "/templates" },
  ];

  return (
    <>
      {/* Overlay */}
      {!collapsed && (
        <div
          onClick={toggleSidebar}
          className="w-full h-screen inset-0 z-30 bg-black opacity-70 fixed lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed h-screen z-40 bg-white shadow-md transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-72 sm:w-80 lg:w-64"} ${isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0") : ""
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className={`flex items-center px-4 py-6 ${collapsed ? "justify-center" : "justify-start gap-2"}`}>
            <div
              src="/logo.png"
              alt="DentSoft Logo"
              className="bg-blue-600 p-1 rounded-sm text-white text-3xl"
            >
              <TbDental />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <h1 className="text-xl font-bold text-blue-600">DentSoft</h1>
                <p className="text-[10px] text-gray-500">
                  {" "}
                  Advanced Clinic Management System
                </p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="ml-auto text-gray-500 hover:text-blue-600 lg:hidden"
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} collapsed={collapsed} />
              ))}
            </ul>
          </nav>

          {/* Footer/Logout */}
          <div className={`p-4 ${collapsed ? "text-center" : ""}`}>
            <button
              onClick={logoutUser}
              className={`flex items-center text-gray-700 hover:text-blue-600 transition-colors
                ${collapsed ? "justify-center mx-auto" : "gap-2"}`}
            >
              <LogOut size={18} />
              {!collapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
