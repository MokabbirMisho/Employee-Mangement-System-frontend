import { data, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination.jsx";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await API.get("/employee", { headers });

        // expected shape: { success: true, employees: [...] }
        if (res.data.success) {
          const sorted = [...res.data.employees].sort((a, b) => {
            const idA = a.employeeId?.toString().trim().toLowerCase() || "";
            const idB = b.employeeId?.toString().trim().toLowerCase() || "";
            return idA.localeCompare(idB, undefined, { numeric: true });
          });
          setEmployees(sorted);
        } else {
          setError("Failed to fetch employees");
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Something went wrong while fetching employees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this employee?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const headers = {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  };
                  const res = await API.delete(`/employee/${id}`, { headers });

                  if (res.data.success) {
                    setEmployees((prev) =>
                      prev.filter((emp) => emp._id !== id)
                    );
                    toast.success("Employee deleted successfully");
                  } else {
                    toast.error("Delete failed");
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.error || "Error deleting employee"
                  );
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/employees/edit/${id}`);
  };

  // filter by employee name (from populated userId)
  const filteredEmployees = employees.filter((emp) =>
    emp.userId?.name?.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  );

  const totalItems = filteredEmployees.length;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const pageData = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700">
          Loading employees...
        </p>
      </div>
    );

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Manage Employees</h1>
      </div>

      {/* Search + Add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <input
          type="text"
          placeholder="Search by Employee Name"
          className="px-4 py-2 w-full sm:w-64 border bg-gray-100 rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 text-center"
        >
          Add New Employee
        </Link>
      </div>

      {/* Table wrapper with horizontal scroll on small screens */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 font-medium whitespace-nowrap">ID</th>
                <th className="p-3 font-medium whitespace-nowrap">Avatar</th>
                <th className="p-3 font-medium whitespace-nowrap">Name</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Department
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Designation
                </th>
                <th className="p-3 font-medium text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((emp, index) => (
                <tr
                  key={emp._id || index}
                  className="hover:bg-gray-50 border-b last:border-none"
                >
                  {/* ID (human readable) */}
                  <td className="p-3 whitespace-nowrap">
                    {emp.employeeId || "—"}
                  </td>

                  {/* Avatar */}
                  <td className="p-3 whitespace-nowrap">
                    <img
                      width={40}
                      height={40}
                      src={
                        emp.userId?.avatar
                          ? `${API_BASE_URL}/uploads/${emp.userId.avatar}`
                          : "/no-avatar.png"
                      }
                      alt={emp.userId?.name || "avatar"}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>

                  {/* Name */}
                  <td className="p-3 whitespace-nowrap">
                    {emp.userId?.name || "—"}
                  </td>

                  {/* Department */}
                  <td className="p-3 whitespace-nowrap">
                    {emp.department?.dept_name || "—"}
                  </td>

                  {/* Designation */}
                  <td className="p-3 whitespace-nowrap">
                    {emp.designation || "—"}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        onClick={() => handleEdit(emp._id)}
                        className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 w-24 sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 w-24 sm:w-auto"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin-dashboard/employees/${emp._id}`)
                        }
                        className="px-3 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 w-24 sm:w-auto"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No matching employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
