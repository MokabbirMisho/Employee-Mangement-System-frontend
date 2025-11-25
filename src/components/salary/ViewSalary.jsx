import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get("/salary", { headers });

        if (res.data.success) {
          setSalaries(res.data.salaries || []);
        } else {
          toast.error(res.data.error || "Failed to load salaries");
        }
      } catch (err) {
        console.error("Error fetching salaries:", err);
        toast.error(
          err?.response?.data?.error || "Server error while loading salaries"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  // ---- Filters helpers ----
  const departmentOptions = useMemo(() => {
    const map = new Map();
    salaries.forEach((sal) => {
      if (sal.department?._id) {
        map.set(sal.department._id, sal.department.dept_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [salaries]);

  const monthOptions = useMemo(() => {
    const set = new Set();
    salaries.forEach((sal) => {
      if (sal.payDate) {
        const d = new Date(sal.payDate);
        if (!Number.isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          set.add(key);
        }
      }
    });

    return Array.from(set)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        const date = new Date(Number(year), Number(month) - 1, 1);
        const label = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return { key, label };
      });
  }, [salaries]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  // ---- Apply filters & sort by total salary (desc) ----
  const filteredAndSortedSalaries = useMemo(() => {
    const filtered = salaries.filter((sal) => {
      const emp = sal.employee;
      const user = emp?.userId;
      const dept = sal.department;

      const name = user?.name || "";
      const matchesSearch = name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === "all" || dept?._id === selectedDept;

      let matchesMonth = true;
      if (selectedMonth !== "all") {
        if (!sal.payDate) {
          matchesMonth = false;
        } else {
          const d = new Date(sal.payDate);
          if (Number.isNaN(d.getTime())) {
            matchesMonth = false;
          } else {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              "0"
            )}`;
            matchesMonth = key === selectedMonth;
          }
        }
      }

      return matchesSearch && matchesDept && matchesMonth;
    });

    // sort by total salary desc: (basic + allowance)
    return filtered.sort((a, b) => {
      const totalA = (a.basicSalary || 0) + (a.allowance || 0);
      const totalB = (b.basicSalary || 0) + (b.allowance || 0);
      return totalB - totalA;
    });
  }, [salaries, searchTerm, selectedDept, selectedMonth]);

  // ---- Pagination ----
  const totalItems = filteredAndSortedSalaries.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
  const pageData = filteredAndSortedSalaries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700 mt-2">
          Loading salary data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Employee Salaries</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of employee salary details
        </p>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        {/* Left: search + filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

          <select
            className="px-3 py-2 border bg-gray-100 rounded-md text-sm w-full sm:w-48"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border bg-gray-100 rounded-md text-sm w-full sm:w-48"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Months</option>
            {monthOptions.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Add Salary only */}
        <div className="flex gap-2 justify-end">
          <Link
            to="/admin-dashboard/salary/add"
            className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
          >
            Update Salary
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 font-medium whitespace-nowrap">Emp ID</th>
                <th className="p-3 font-medium whitespace-nowrap">Name</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Department
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Basic Salary
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Allowance</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Deductions
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Total Salary
                </th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Net Salary
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((sal) => {
                const emp = sal.employee;
                const user = emp?.userId;
                const dept = sal.department;

                const basic = sal.basicSalary || 0;
                const allowance = sal.allowance || 0;
                const deductions = sal.deductions || 0;
                const totalSalary = basic + allowance;
                const netSalary = sal.netSalary ?? totalSalary - deductions;

                return (
                  <tr
                    key={sal._id}
                    className="hover:bg-gray-50 border-b last:border-none"
                  >
                    <td className="p-3 whitespace-nowrap">
                      {sal.employeeId || emp?.employeeId || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {user?.name || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {dept?.dept_name || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      € {basic.toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      € {allowance.toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      € {deductions.toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      € {totalSalary.toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      € {netSalary.toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(sal.payDate)}
                    </td>
                  </tr>
                );
              })}

              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No salaries found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPageSafe - 1)}
          className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPageSafe === 1}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPageSafe} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPageSafe + 1)}
          className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPageSafe === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewSalary;
