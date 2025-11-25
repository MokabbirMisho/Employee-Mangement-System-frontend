import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import ActionButton from "../common/Button.jsx";

const AdminLeaves = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // search by department name
  const [statusFilter, setStatusFilter] = useState("all"); // all | Pending | Approved | Rejected

  // Helpers
  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const getTotalDays = (from, to) => {
    if (!from || !to) return "—";
    const start = new Date(from);
    const end = new Date(to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return "—";
    const diffMs = end - start;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return days > 0 ? days : 1;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // 🔹 Fetch leaves from backend (admin)
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // you will implement GET /leave/admin on backend
        const res = await API.get("/leave/admin", { headers });

        if (res.data.success) {
          setLeaves(res.data.leaves || []);
        } else {
          toast.error(res.data.error || "Failed to load leaves");
        }
      } catch (err) {
        console.error("AdminLeaves fetch error:", err);
        toast.error(
          err?.response?.data?.error || "Server error while loading leaves list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // 🔹 Filter leaves by department + status
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      // expect populated structure: leave.employee.department.dept_name
      const deptName =
        leave.employee?.department?.dept_name ||
        leave.department?.dept_name || // in case you populated department directly
        "";

      const matchesDept = deptName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const currentStatus = (leave.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "all" || currentStatus === statusFilter.toLowerCase();

      return matchesDept && matchesStatus;
    });
  }, [leaves, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700 mt-2">
          Loading leave requests...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Manage Leaves</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage all employee leave requests
        </p>
      </div>

      {/* Search + Status filter buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* Search by department */}
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Department Name"
            className="px-4 py-2 w-full sm:w-72 border bg-gray-100 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filter buttons using ActionButton */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <ActionButton
            variant="pending"
            onClick={() => setStatusFilter("Pending")}
            className={
              statusFilter === "Pending"
                ? ""
                : "opacity-80 border border-yellow-300"
            }
          >
            Pending
          </ActionButton>

          <ActionButton
            variant="default"
            onClick={() => setStatusFilter("Approved")}
            className={
              statusFilter === "Approved"
                ? ""
                : "opacity-80 border border-teal-300"
            }
          >
            Approved
          </ActionButton>

          <ActionButton
            variant="reject"
            onClick={() => setStatusFilter("Rejected")}
            className={
              statusFilter === "Rejected"
                ? ""
                : "opacity-80 border border-red-300"
            }
          >
            Rejected
          </ActionButton>

          {/* "All" can just reuse default style or pending with extra class */}
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium shadow border transition ${
              statusFilter === "all"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 font-medium whitespace-nowrap">SL</th>
                <th className="p-3 font-medium whitespace-nowrap">Emp ID</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Employee Name
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Department
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Leave From
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Leave To</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Total Days
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Status</th>
                <th className="p-3 font-medium whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => {
                // expecting populate result:
                // leave.employee.employeeId
                // leave.employee.userId.name
                // leave.employee.department.dept_name
                const emp = leave.employee || {};
                const user = emp.userId || {};
                const dept = emp.department || leave.department || {};

                return (
                  <tr
                    key={leave._id || index}
                    className="hover:bg-gray-50 border-b last:border-none"
                  >
                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 whitespace-nowrap">
                      {emp.employeeId || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {user.name || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {dept.dept_name || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(leave.fromDate)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(leave.toDate)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {getTotalDays(leave.fromDate, leave.toDate)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          leave.status
                        )}`}
                      >
                        {leave.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-800 shadow"
                        onClick={() =>
                          navigate(`/admin-dashboard/leaves/${leave._id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredLeaves.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No leave requests found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaves;
