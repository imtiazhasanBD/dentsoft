import { LogOut, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { CiCalendar } from "react-icons/ci";
import { TiHomeOutline } from "react-icons/ti";
import { IoIosPeople } from "react-icons/io";
import { TbFileInvoice } from "react-icons/tb";
import { PiInvoiceDuotone } from "react-icons/pi";
import { CgTemplate } from "react-icons/cg";
import { useUser } from "../context/UserContext";


const SiderBar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const { logoutUser } = useUser();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="w-full h-screen inset-0 z-30 bg-black opacity-70 fixed lg:hidden"
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`bg-white text-gray-800 shadow-md w-72 h-full fixed top-0 transform transition-transform duration-500 ease-in-out z-40 
      ${isOpen ? "translate-x-0 left-0" : "-translate-x-full left-0"} 
      lg:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <X onClick={toggleSidebar} className="absolute top-4 right-4 text-xl text-blue-700 cursor-pointer lg:hidden" />
        <div className="flex items-center py-4 px-6 mb-3 gap-2">
          <img
            src="/logo.png"
            alt="DentSoft Logo"
            className="w-8"
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-bold text-blue-600">DentSoft</h1>
            <p className="text-[10px] text-gray-500">
              Advanced Clinic Management System
            </p>
          </div>
        </div>
        <nav className="h-full flex flex-col pb-24 justify-between">
          <ul className="font-semibold">
            <li className="mb-4 w-full">
              <button
                className={`hover:text-blue-600 flex items-center gap-2 py-3 px-6 w-full ${
                  pathname === "/"
                    ? "text-blue-600 bg-gray-100 border-r-4 border-r-blue-600"
                    : ""
                }`}
              >
                <TiHomeOutline size={"1.4rem"} />
                Home
              </button>
            </li>
            <li className="mb-4">
              <button className="hover:text-blue-600 flex items-center gap-2 py-3 px-6">
                <CiCalendar size={"1.4rem"} />
                Appointments
              </button>
            </li>
            <li className="mb-4">
              <button className="hover:text-blue-600 flex items-center gap-2 py-3 px-6">
                <IoIosPeople size={"1.4rem"} />
                Patients
              </button>
            </li>
            <li className="mb-4">
              <button className="hover:text-blue-600 flex items-center gap-2 py-3 px-6">
                <TbFileInvoice size={"1.4rem"} />
                Invoices
              </button>
            </li>
            <li className="mb-4">
              <button className="hover:text-blue-600 flex items-center gap-2 py-3 px-6">
                <PiInvoiceDuotone size={"1.4rem"} />
                Expenses
              </button>
            </li>
            <li className="mb-4">
              <button className="hover:text-blue-600 flex items-center gap-2 py-3 px-6">
                <CgTemplate size={"1.4rem"} />
                Templates
              </button>
            </li>
          </ul>
          <button className="flex gap-2 items-center font-semibold hover:text-indigo-700 text-sm py-3 px-6 cursor-pointer" onClick={logoutUser}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default SiderBar;
