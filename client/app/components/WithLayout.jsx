"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";


export default function WithLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/register';

  return isLoginPage ? children : <CustomLayout>{children}</CustomLayout>;
}