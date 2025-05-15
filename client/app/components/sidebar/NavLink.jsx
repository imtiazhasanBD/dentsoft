import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ Icon, label, path, collapsed }) => {
      const pathname = usePathname();

  return (
    <Link
      href={path}
      className={`flex items-center rounded-lg p-3 hover:bg-gray-100 transition-colors ${
        pathname === path ? "bg-blue-50 text-blue-600" : "text-gray-700"
      } ${collapsed ? "justify-center" : "gap-3"}`}
    >
      <Icon size={20} />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default NavLink;
