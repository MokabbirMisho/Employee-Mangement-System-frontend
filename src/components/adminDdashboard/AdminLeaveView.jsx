import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import ActionButton from "../common/Button.jsx";

const AdminLeaveView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const getTotalDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diff = end - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get(`/leave/admin/${id}`, { headers });

        if (res.data.success) {
          setLeave(res.data.leave);
        } else {
          toast.error("Failed to load leave details");
        }
      } catch (err) {
        toast.error("Server error fetching leave");
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await API.put(
        `/leave/admin/${id}/status`,
        { status },
        { headers }
      );

      if (res.data.success) {
        toast.success(`Leave ${status}`);
        navigate("/admin-dashboard/leaves");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="loading loading-lg"></span>
      </div>
    );

  if (!leave) return <div className="p-4">Leave not found</div>;

  const emp = leave.employee || {};
  const user = emp.userId || {};
  const dept = emp.department || {};

  const avatar = user.avatar
    ? `http://localhost:5000/uploads/${user.avatar}`
    : "/no-avatar.png";

  return (
    <div className="p-4 sm:p-6 flex justify-center">
      <div className="max-w-3xl bg-gray-100 shadow-lg rounded-xl w-full p-6 space-y-6">
        {/* Back */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-800 shadow"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center">
          Leave Request Details
        </h1>

        {/* Employee Card */}
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border shadow"
          />

          <div className="flex-1 space-y-2">
            <p>
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className="font-medium text-gray-700">Employee ID:</span>{" "}
              {emp.employeeId}
            </p>
            <p>
              <span className="font-medium text-gray-700">Designation:</span>{" "}
              {emp.designation}
            </p>
            <p>
              <span className="font-medium text-gray-700">Department:</span>{" "}
              {dept.dept_name}
            </p>
            <p>
              <span className="font-medium text-gray-700">Leave Type:</span>{" "}
              {leave.leaveType}
            </p>
          </div>
        </div>

        {/* Leave Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">From:</span>{" "}
            {formatDate(leave.fromDate)}
          </p>
          <p>
            <span className="font-semibold">To:</span>{" "}
            {formatDate(leave.toDate)}
          </p>
          <p>
            <span className="font-semibold">Total Days:</span>{" "}
            {getTotalDays(leave.fromDate, leave.toDate)}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {leave.status}
          </p>
        </div>

        {/* Description */}
        <div>
          <span className="font-semibold">Description:</span>
          <p className="text-gray-700 mt-1">{leave.description}</p>
        </div>

        {/* Approve / Reject Buttons */}
        <div className="flex gap-3 justify-end">
          <ActionButton
            variant="default"
            onClick={() => handleStatusUpdate("Approved")}
          >
            Approve
          </ActionButton>

          <ActionButton
            variant="reject"
            onClick={() => handleStatusUpdate("Rejected")}
          >
            Reject
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveView;
