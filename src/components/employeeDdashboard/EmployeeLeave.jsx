import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const EmployeeLeave = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch leaves from backend on mount
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get("/leave/my", { headers });

        if (res.data.success) {
          setLeaves(res.data.leaves || []);
        } else {
          toast.error(res.data.error || "Failed to load leaves");
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
        toast.error(
          err?.response?.data?.error || "Server error while loading leaves"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  // Filter by search + status
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch = leave.leaveType
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        leave.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaves, searchTerm, statusFilter]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-height-[50vh] min-h-[50vh] ">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700 mt-2">
          Loading leave requests...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 bg-gray-100">
          <h1 className="text-xl sm:text-2xl font-semibold">
            My Leave Requests
          </h1>
        </div>

        {/* Search + Filters + Add button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* Left: search + status filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by leave Status"
              className="px-3 sm:px-4 py-2 w-full sm:w-72 border bg-gray-100 rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-3 py-2 border bg-gray-100 rounded-md text-sm w-full sm:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Right: Add Leave button */}
          <div className="flex justify-end w-full sm:w-auto">
            <button
              onClick={() => navigate("/employee-dashboard/leave/add")}
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 text-white rounded-md 
                         text-sm font-medium shadow-sm hover:bg-teal-700 
                         transition-all duration-200"
            >
              Add Leave
            </button>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 font-medium whitespace-nowrap">SL</th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Leave Type
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">From</th>
                  <th className="p-3 font-medium whitespace-nowrap">To</th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Description
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Applied Date
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, index) => (
                  <tr
                    key={leave._id || index}
                    className="hover:bg-gray-50 border-b last:border-none"
                  >
                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 whitespace-nowrap">
                      {leave.leaveType || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(leave.fromDate)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(leave.toDate)}
                    </td>
                    <td className="p-3 whitespace-nowrap max-w-xs sm:max-w-sm truncate">
                      {leave.description || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(leave.appliedAt)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-[0.7rem] sm:text-xs font-medium ${getStatusBadgeClass(
                          leave.status
                        )}`}
                      >
                        {leave.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredLeaves.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No leave records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
