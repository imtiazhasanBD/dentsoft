"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NavItem = ({ icon: Icon, label, path, collapsed }) => {
  const [enableTooltips, setEnableTooltips] = useState(true);
  const pathname = usePathname();

  // Completely disable tooltips during transition
  useEffect(() => {
    setEnableTooltips(false);
    const timer = setTimeout(() => {
      setEnableTooltips(collapsed);
    }, 300); // Match this with your transition duration
    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <>
        {enableTooltips ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={path} className={`flex items-center rounded-lg p-3 hover:bg-gray-100 transition-colors ${ pathname === path  ? "bg-blue-50 text-blue-600" : "text-gray-700" } ${collapsed ? "justify-center" : "gap-3"}`}>
                  <Icon size={20} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Link href={path} className={`flex items-center rounded-lg p-3 hover:bg-gray-100 transition-colors ${ pathname === path? "bg-blue-50 text-blue-600" : "text-gray-700"} ${collapsed ? "justify-center" : "gap-3"}`} >
            <Icon size={20} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </Link>
        )}
    </>
  );
};

export default NavItem;
