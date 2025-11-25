import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const ViewMySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  useEffect(() => {
    const fetchMySalary = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get("/salary/my", { headers });

        if (res.data.success) {
          setSalaries(res.data.salaries || []);
          setEmployeeInfo(res.data.employee || null);
        } else {
          toast.error(res.data.error || "Failed to load salary data");
        }
      } catch (err) {
        console.error("Error fetching my salary:", err);
        toast.error(
          err?.response?.data?.error || "Server error while loading salary"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMySalary();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] ">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700 mt-2">
          Loading salary details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">My Salary</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your salary details
          </p>
        </div>

        {/* Employee info small summary */}
        {employeeInfo && (
          <div className="bg-gray-100 shadow-md rounded-lg p-4 mb-4 text-sm sm:text-base">
            <p>
              <span className="font-semibold text-gray-700">Employee ID:</span>{" "}
              {employeeInfo.employeeId || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Department:</span>{" "}
              {employeeInfo.department?.dept_name || "—"}
            </p>
          </div>
        )}

        {/* Salary table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 font-medium whitespace-nowrap">SL</th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Pay Date
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Basic Salary
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Allowance
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Deductions
                  </th>
                  <th className="p-3 font-medium whitespace-nowrap">
                    Total (Basic + Allowance)
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((sal, index) => {
                  const basic = sal.basicSalary || 0;
                  const allowance = sal.allowance || 0;
                  const deductions = sal.deductions || 0;
                  const total = basic + allowance;
                  const net =
                    sal.netSalary != null ? sal.netSalary : total - deductions;

                  return (
                    <tr
                      key={sal._id || index}
                      className="hover:bg-gray-50 border-b last:border-none"
                    >
                      <td className="p-3 whitespace-nowrap">{index + 1}</td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(sal.payDate)}
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
                        € {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {salaries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No salary records found.
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

export default ViewMySalary;
