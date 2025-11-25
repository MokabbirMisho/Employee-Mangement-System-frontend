import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination.jsx";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // change if you want

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await API.get("/department", { headers });

        // Adjust this if your response shape differs
        if (res.data.success) {
          setDepartments(res.data.departments);
        } else {
          setError("Failed to fetch departments");
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Something went wrong while fetching departments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this department?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const headers = {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  };
                  const res = await API.delete(`/department/${id}`, {
                    headers,
                  });

                  if (res.data.success) {
                    setDepartments((prev) =>
                      prev.filter((dept) => dept._id !== id)
                    );
                    toast.success("Department deleted successfully");
                  } else {
                    toast.error("Delete failed");
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.error || "Error deleting department"
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
    navigate(`/admin-dashboard/edit-department/${id}`);
    // You can navigate or open edit form here
  };

  // simple filter
  const filteredDepartments = departments.filter((dept) =>
    dept.dept_name?.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const totalItems = filteredDepartments.length;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const pageData = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700">
          Loading departments...
        </p>
      </div>
    );

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Manage Department</h1>
      </div>

      {/* Search + Add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <input
          type="text"
          placeholder="Search by Department Name"
          className="px-4 py-2 w-full sm:w-64 border bg-gray-100 rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset on new search
          }}
        />

        <Link
          to="/admin-dashboard/add-department"
          className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 text-center"
        >
          Add New Department
        </Link>
      </div>

      {/* Table wrapper */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 font-medium whitespace-nowrap">SL</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Department Name
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Head</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Description
                </th>
                <th className="p-3 font-medium text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((dept, index) => (
                <tr
                  key={dept._id || index}
                  className="hover:bg-gray-50 border-b last:border-none"
                >
                  {/* SL should continue across pages */}
                  <td className="p-3 whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-3 whitespace-nowrap">{dept.dept_name}</td>

                  <td className="p-3 whitespace-nowrap">
                    {dept.dept_head || "—"}
                  </td>

                  <td className="p-3">
                    {/* allow wrapping for long descriptions */}
                    {dept.description || "—"}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        onClick={() => handleEdit(dept._id)}
                        className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 w-24 sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 w-24 sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No matching departments found.
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

export default Departments;
