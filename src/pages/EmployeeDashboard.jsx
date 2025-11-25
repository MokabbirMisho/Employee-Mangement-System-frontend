import { useState } from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/employeeDdashboard/EmployeeSidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="drawer md:drawer-open min-h-screen">
      {/* Drawer toggle */}
      <input
        id="admin-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* Navbar gets the button to toggle sidebar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Actual pages */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          className="drawer-overlay"
          onClick={() => setSidebarOpen(false)}
        ></label>

        <EmployeeSidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
