import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Euro,
  CalendarDays,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

import API from "../../utils/api.js";
import toast from "react-hot-toast";
import SummaryCard from "../common/SummaryCard";

const AdminSummary = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlySalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // Employees, departments, and all leaves for admin
        const [empRes, deptRes, leaveRes] = await Promise.all([
          API.get("/employee", { headers }),
          API.get("/department", { headers }),
          API.get("/leave/admin", { headers }),
        ]);

        // ---- Employees ----
        let totalEmployees = 0;
        let monthlySalary = 0;

        if (empRes.data?.success) {
          const employees = empRes.data.employees || [];
          totalEmployees = employees.length;

          // Sum current salary from Employee model (we already save net salary there)
          monthlySalary = employees.reduce(
            (sum, emp) => sum + (Number(emp.salary) || 0),
            0
          );
        } else {
          toast.error(empRes.data?.error || "Failed to load employees");
        }

        // ---- Departments ----
        let totalDepartments = 0;
        if (deptRes.data?.success) {
          const departments = deptRes.data.departments || [];
          totalDepartments = departments.length;
        } else {
          toast.error(deptRes.data?.error || "Failed to load departments");
        }

        // ---- Leaves ----
        let leaveApplied = 0;
        let leaveApproved = 0;
        let leavePending = 0;
        let leaveRejected = 0;

        if (leaveRes.data?.success) {
          const leaves = leaveRes.data.leaves || [];
          leaveApplied = leaves.length;
          leaveApproved = leaves.filter((l) => l.status === "Approved").length;
          leavePending = leaves.filter((l) => l.status === "Pending").length;
          leaveRejected = leaves.filter((l) => l.status === "Rejected").length;
        } else {
          toast.error(leaveRes.data?.error || "Failed to load leaves");
        }

        setStats({
          totalEmployees,
          totalDepartments,
          monthlySalary,
          leaveApplied,
          leaveApproved,
          leavePending,
          leaveRejected,
        });
      } catch (error) {
        console.error("AdminSummary fetch error:", error);
        toast.error(
          error?.response?.data?.error || "Error loading dashboard overview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const {
    totalEmployees,
    totalDepartments,
    monthlySalary,
    leaveApplied,
    leaveApproved,
    leavePending,
    leaveRejected,
  } = stats;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-center">Dashboard Overview</h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-bars loading-lg text-accent"></span>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Top summary cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <SummaryCard
              icon={<Users />}
              text="Total Employees"
              number={totalEmployees}
              color="bg-teal-500"
            />
            <SummaryCard
              icon={<Building2 />}
              text="Total Departments"
              number={totalDepartments}
              color="bg-yellow-500"
            />
            <SummaryCard
              icon={<Euro />}
              text="Monthly Salary (Net)"
              number={`€ ${monthlySalary.toLocaleString()}`}
              color="bg-red-500"
            />
          </div>

          {/* Leave stats */}
          <div className="mt-12">
            <h4 className="text-center text-2xl font-bold">Leave Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <SummaryCard
                icon={<CalendarDays />}
                text="Leave Applied"
                number={leaveApplied}
                color="bg-teal-500"
              />
              <SummaryCard
                icon={<CheckCircle />}
                text="Leave Approved"
                number={leaveApproved}
                color="bg-green-700"
              />
              <SummaryCard
                icon={<Clock />}
                text="Leave Pending"
                number={leavePending}
                color="bg-yellow-500"
              />
              <SummaryCard
                icon={<XCircle />}
                text="Leave Rejected"
                number={leaveRejected}
                color="bg-red-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSummary;
