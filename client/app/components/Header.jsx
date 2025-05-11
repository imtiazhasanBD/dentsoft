import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { RiFullscreenExitFill } from "react-icons/ri";
import RealTimeClock from "./RealTimeClock";
import { useUser } from "../context/UserContext";
import Image from "next/image";

const Header = ({toggleSidebar}) => {
  const { user, loading, error } = useUser();

  console.log(user);

  return (
    <div className="fixed inset-0 lg:left-72 z-20">
      <div className="w-full md:py-4 p-4 md:px-10 bg-white flex justify-between items-center text-gray-600">
        <div className="flex gap-2 items-center">
          {/* Toggle Button for Mobile */}
          <button onClick={toggleSidebar} className="lg:hidden text-blue-600 p-2">☰</button>
          <RealTimeClock />
        </div>
        {/* Notification and User Icons */}
        <div className="flex gap-2 items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <RiFullscreenExitFill size={"1.4rem"} className="text-blue-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <IoMdNotificationsOutline
              size={"1.4rem"}
              className="text-blue-600"
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2 font-semibold">
            {user ? (
              <Image
                src={`/${user?.role}.png`}
                alt={user?.role}
                width={30}
                height={30}
              />
            ) : (
              <FaRegUserCircle size={"1.8rem"} className="text-blue-600" />
            )}
            <span className="hidden md:block">{user ? user.name : "Guest"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
