import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Settings,
} from "lucide-react";

const EmployeeSidebar = ({ closeSidebar }) => {
  const links = [
    {
      to: "/employee-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      to: "/employee-dashboard/profile",
      label: "My Profile",
      icon: <Users size={20} />,
    },
    {
      to: "/employee-dashboard/salary",
      label: "Salary",
      icon: <Wallet size={20} />,
    },
    {
      to: "/employee-dashboard/leave",
      label: "Leave",
      icon: <Calendar size={20} />,
    },
    {
      to: "/employee-dashboard/settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-100 h-full p-4">
      {/* Desktop title only */}
      <div className="hidden md:block border-b mb-6">
        <Link to="/employee-dashboard">
          <h2 className="text-2xl font-lobster text-center mb-2 text-teal-600">
            EMS Dashboard
          </h2>
        </Link>
      </div>

      <nav className="flex flex-col gap-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={closeSidebar} // close menu on mobile
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive ? "bg-gray-300" : "hover:bg-gray-200"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;
