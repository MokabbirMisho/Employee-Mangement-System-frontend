import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import {
  Wallet,
  Calendar,
  User,
  Activity,
  Settings,
  ArrowRight,
} from "lucide-react";

const EmployeeSummary = () => {
  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  // Derive some stats
  const latestSalary = useMemo(() => {
    if (!salaries.length) return null;
    return salaries[0]; // assume backend sorted
  }, [salaries]);

  const leaveStats = useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const latest = leaves[0] || null;
    return { total, pending, approved, latest };
  }, [leaves]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const [empRes, salRes, leaveRes] = await Promise.all([
          API.get("/employee/me/profile", { headers }),
          API.get("/salary/my", { headers }),
          API.get("/leave/my", { headers }),
        ]);

        if (empRes.data.success) {
          setEmployee(empRes.data.employee || null);
        } else {
          toast.error(empRes.data.error || "Failed to load profile");
        }

        if (salRes.data.success) {
          setSalaries(salRes.data.salaries || []);
        } else {
          toast.error(salRes.data.error || "Failed to load salaries");
        }

        if (leaveRes.data.success) {
          setLeaves(leaveRes.data.leaves || []);
        } else {
          toast.error(leaveRes.data.error || "Failed to load leaves");
        }
      } catch (err) {
        console.error("Employee dashboard error:", err);
        toast.error(
          err?.response?.data?.error || "Error loading employee dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] ">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700 mt-2">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const user = employee?.userId || {};
  const dept = employee?.department;

  const avatarUrl = user.avatar
    ? `http://localhost:5000/uploads/${user.avatar}`
    : "/no-avatar.png";

  const basic = latestSalary?.basicSalary || 0;
  const allowance = latestSalary?.allowance || 0;
  const deductions = latestSalary?.deductions || 0;
  const total = basic + allowance;
  const net =
    latestSalary?.netSalary != null
      ? latestSalary.netSalary
      : total - deductions;

  return (
    <div className="min-h-screen ">
      <div className="p-4 sm:p-6 h-full">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top: Welcome + Profile card + Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
            {/* Profile card */}
            <div className="bg-gray-50 shadow-md rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="shrink-0 flex justify-center sm:justify-start">
                <img
                  src={avatarUrl}
                  alt={user.name || "Employee avatar"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase text-gray-400 mb-1">
                  Welcome back,
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {user.name || "—"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Employee ID:</span>{" "}
                  {employee?.employeeId || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Department:</span>{" "}
                  {dept?.dept_name || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Designation:</span>{" "}
                  {employee?.designation || "—"}
                </p>
              </div>
            </div>

            {/* Quick stats cards */}
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Current salary */}
              <div className="bg-gray-50 shadow-md rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 uppercase">
                    Current Net Salary
                  </span>
                  <div className="p-2 rounded-full bg-teal-50">
                    <Wallet size={18} className="text-teal-600" />
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {latestSalary ? `€ ${net.toLocaleString()}` : "—"}
                </p>
                <p className="text-xs text-gray-600">
                  {latestSalary
                    ? `Last paid: ${formatDate(latestSalary.payDate)}`
                    : "No salary record yet"}
                </p>
              </div>

              {/* Leaves stats */}
              <div className="bg-gray-50 shadow-md rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 uppercase">
                    Leave Overview
                  </span>
                  <div className="p-2 rounded-full bg-blue-50">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {leaveStats.total} leave(s)
                </p>
                <p className="text-xs text-gray-500">
                  Pending:{" "}
                  <span className="font-semibold">{leaveStats.pending}</span> •
                  Approved:{" "}
                  <span className="font-semibold">{leaveStats.approved}</span>
                </p>
              </div>

              {/* Account summary */}
              <div className="bg-gray-50 shadow-md rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 uppercase">
                    Account
                  </span>
                  <div className="p-2 rounded-full bg-purple-50">
                    <User size={18} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-800 truncate">
                  {user.email || "No email"}
                </p>
                <p className="text-xs text-gray-700">
                  Role:{" "}
                  <span className="font-semibold">
                    {user.role || "Employee"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-gray-50 shadow-md rounded-xl p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() =>
                  navigate(`/employee-dashboard/profile/${user._id}`)
                }
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-100 text-xs sm:text-sm"
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => navigate("/employee-dashboard/salary")}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-100 text-xs sm:text-sm"
              >
                <Wallet size={16} />
                <span>My Salary</span>
              </button>
              <button
                onClick={() => navigate("/employee-dashboard/leave")}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-100 text-xs sm:text-sm"
              >
                <Calendar size={16} />
                <span>My Leave</span>
              </button>
              <button
                onClick={() => navigate("/employee-dashboard/settings")}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-100 text-xs sm:text-sm"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-gray-50 shadow-md rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                Recent Activity
              </h3>
              <Activity size={18} className="text-gray-400" />
            </div>

            <div className="space-y-3 text-sm">
              {/* Salary activity */}
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-teal-500"></div>
                <div>
                  <p className="font-medium text-gray-800">Salary update</p>
                  <p className="text-xs text-gray-600">
                    {latestSalary
                      ? `Your latest net salary is € ${net.toLocaleString()} (paid on ${formatDate(
                          latestSalary.payDate
                        )}).`
                      : "No salary record available yet."}
                  </p>
                </div>
              </div>

              {/* Leave activity */}
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium text-gray-800">Leave request</p>
                  <p className="text-xs text-gray-600">
                    {leaveStats.latest
                      ? `Your last leave (${
                          leaveStats.latest.leaveType
                        }) from ${formatDate(
                          leaveStats.latest.fromDate
                        )} to ${formatDate(
                          leaveStats.latest.toDate
                        )} is currently "${leaveStats.latest.status}".`
                      : "You have not submitted any leave request yet."}
                  </p>
                </div>
              </div>

              {/* Account info */}
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-gray-400"></div>
                <div>
                  <p className="font-medium text-gray-800">Account details</p>
                  <p className="text-xs text-gray-600">
                    Keep your profile and contact information up to date in the
                    Settings and Profile pages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;
