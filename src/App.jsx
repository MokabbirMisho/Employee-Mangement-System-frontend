import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx";
import AdminSummary from "./components/adminDdashboard/AdminSummary.jsx";
import Departments from "./components/department/Departments.jsx";
import AddDepartment from "./components/department/AddDepartment.jsx";
import EditDepartment from "./components/department/EditDepartment.jsx";
import EmployeeList from "./components/employee/EmployeeList.jsx";
import AddEmployee from "./components/employee/AddEmployee.jsx";
import AddSalary from "./components/salary/AddSalary.jsx";
import ViewSalary from "./components/salary/ViewSalary.jsx";
import EmployeeProfile from "./components/employee/EmployeeProfile.jsx";
import UpdateEmployee from "./components/employee/UpdateEmployee.jsx";
import EmployeeSummary from "./components/employeeDdashboard/EmployeeSummary.jsx";
import EmployeeMyProfile from "./components/employeeDdashboard/EmployeeMyProfile.jsx";
import EmployeeLeave from "./components/employeeDdashboard/EmployeeLeave.jsx";
import AddLeave from "./components/employeeDdashboard/AddLeave.jsx";
import ViewMySalary from "./components/employeeDdashboard/ViewMySalary.jsx";
import PasswardSetting from "./components/employeeDdashboard/PasswardSetting.jsx";
import AdminLeaves from "./components/adminDdashboard/AdminLeaves.jsx";
import AdminSettings from "./components/adminDdashboard/AdminSettings.jsx";
import AdminLeaveView from "./components/adminDdashboard/AdminLeaveView.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes checkRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/admin-dashboard/departments"
            element={<Departments />}
          />
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/admin-dashboard/edit-department/:id"
            element={<EditDepartment />}
          />
          <Route path="/admin-dashboard/leaves" element={<AdminLeaves />} />
          <Route
            path="/admin-dashboard/leaves/:id"
            element={<AdminLeaveView />}
          />

          <Route path="/admin-dashboard/employees" element={<EmployeeList />} />
          <Route path="employees/edit/:id" element={<UpdateEmployee />} />

          <Route
            path="/admin-dashboard/employees/:id"
            element={<EmployeeProfile />}
          />

          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          />
          <Route path="/admin-dashboard/salary" element={<ViewSalary />} />
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
          <Route path="/admin-dashboard/settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes checkRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route
            path="/employee-dashboard/profile"
            element={<EmployeeMyProfile />}
          />
          <Route path="/employee-dashboard/salary" element={<ViewMySalary />} />
          <Route path="/employee-dashboard/leave" element={<EmployeeLeave />} />
          <Route path="/employee-dashboard/leave/add" element={<AddLeave />} />
          <Route
            path="/employee-dashboard/settings"
            element={<PasswardSetting />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
