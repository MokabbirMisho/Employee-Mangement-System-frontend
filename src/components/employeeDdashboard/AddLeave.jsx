import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const AddLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await API.post(
        "/leave",
        {
          leaveType,
          fromDate,
          toDate,
          description,
        },
        { headers }
      );

      if (res.data.success) {
        toast.success("Leave request submitted");
        navigate("/employee-dashboard/leave");
      } else {
        toast.error(res.data.error || "Failed to submit leave");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error || "Server error while submitting leave"
      );
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/leave");
  };

  return (
    <div className="min-h-screen  px-4 py-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-50 shadow-md rounded-lg p-6 sm:p-8">
        <div className="mb-5 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-800">
            Apply for Leave
          </h2>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Leave Type */}
          <div className="flex flex-col sm:col-span-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Leave Type *
            </label>
            <select
              className="px-3 py-2 border bg-white rounded-md text-sm"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select leave type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              From Date *
            </label>
            <input
              type="date"
              className="px-3 py-2 border bg-white rounded-md text-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              To Date *
            </label>
            <input
              type="date"
              className="px-3 py-2 border bg-white rounded-md text-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:col-span-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="px-3 py-2 border bg-white rounded-md text-sm min-h-[90px]"
              placeholder="Reason for leave..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeave;
