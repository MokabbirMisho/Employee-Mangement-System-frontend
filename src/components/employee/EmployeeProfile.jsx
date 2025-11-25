import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react"; // icon

// If you already have a global API_BASE_URL somewhere, use that instead
const API_BASE_URL = "http://localhost:5000"; // change if different

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // this is the employee _id from URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single employee from backend
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get(`/employee/${id}`, { headers });

        if (res.data.success) {
          setEmployee(res.data.employee);
        } else {
          toast.error(res.data.error || "Failed to load employee profile");
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
        toast.error(
          err?.response?.data?.error || "Server error while loading profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-accent"></span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Employee not found.</p>
        <Link
          to="/admin-dashboard/employees"
          className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  const user = employee.userId;
  const dept = employee.department;

  const avatarUrl = user?.avatar
    ? `${API_BASE_URL}/uploads/${user.avatar}`
    : "/no-avatar.png";

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gray-100 shadow-xl rounded-xl overflow-hidden">
        {/* Back button inside card, top-right */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-800 shadow"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row overflow-hidden mx-6 mb-6 md:mb-0">
          {/* Left side: Tall avatar */}
          <div className="md:w-1/3 w-full h-72 md:h-80 ">
            <img
              src={avatarUrl}
              alt={user?.name || "Employee avatar"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side: Employee details */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
              {user?.name || "—"}
            </h2>

            {/* Information List */}
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-gray-700">
                  Employee ID:
                </span>{" "}
                {employee.employeeId || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {user?.email || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">
                  Date of Birth:
                </span>{" "}
                {formatDate(employee.dob)}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Department:</span>{" "}
                {dept?.dept_name || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">
                  Designation:
                </span>{" "}
                {employee.designation || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">Gender:</span>{" "}
                {employee.gender || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">
                  Marital Status:
                </span>{" "}
                {employee.maritalStatus || "—"}
              </p>

              <p>
                <span className="font-semibold text-gray-700">
                  Current Salary:
                </span>{" "}
                {employee.salary != null
                  ? `€ ${employee.salary.toLocaleString()}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
