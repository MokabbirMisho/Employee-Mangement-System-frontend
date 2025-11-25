// src/pages/AddSalary.jsx (or where you keep it)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const AddSalary = () => {
  const navigate = useNavigate();

  // All departments
  const [departments, setDepartments] = useState([]);

  // All employees from backend
  const [employees, setEmployees] = useState([]);

  // Employees filtered by selected department
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // Loading + submitting state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selected employee Mongo _id
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // Form state
  const [form, setForm] = useState({
    department: "", // department _id
    name: "", // auto-filled from employee.userId.name
    employeeId: "", // auto-filled from employee.employeeId
    designation: "", // auto-filled, editable
    basicSalary: "",
    allowance: "",
    deductions: "",
    payDate: "", // date string "YYYY-MM-DD"
  });

  // -------------------------------------------------------------------
  // Fetch departments + employees when component mounts
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // Fetch departments
        const deptRes = await API.get("/department", { headers });

        // Fetch employees (must populate userId + department in backend)
        const empRes = await API.get("/employee", { headers });

        if (deptRes.data.success) {
          setDepartments(deptRes.data.departments);
        } else {
          toast.error("Failed to load departments");
        }

        if (empRes.data.success) {
          setEmployees(empRes.data.employees);
        } else {
          toast.error("Failed to load employees");
        }
      } catch (err) {
        console.error("Error loading salary dependencies:", err);
        toast.error(
          err?.response?.data?.error || "Error loading departments or employees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------------------------------------------------
  // Handle input changes
  // -------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // When department changes:
    if (name === "department") {
      // Reset dependent fields
      setForm((prev) => ({
        ...prev,
        department: value,
        name: "",
        employeeId: "",
        designation: "",
      }));
      setSelectedEmployeeId("");

      // Filter employees by selected department
      const filtered = employees.filter(
        (emp) => emp.department && emp.department._id === value
      );
      setFilteredEmployees(filtered);
      return;
    }

    // When employee changes:
    if (name === "employee") {
      setSelectedEmployeeId(value);

      const emp = employees.find((emp) => emp._id === value);

      if (emp) {
        setForm((prev) => ({
          ...prev,
          name: emp.userId?.name || "",
          employeeId: emp.employeeId || "",
          designation: emp.designation || "",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          name: "",
          employeeId: "",
          designation: "",
        }));
      }

      return;
    }

    // Default case
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------------------------------------------------
  // Validate form before submit
  // -------------------------------------------------------------------
  const validate = () => {
    if (!form.department) {
      toast.error("Department is required");
      return false;
    }

    if (!selectedEmployeeId) {
      toast.error("Employee is required");
      return false;
    }

    if (!form.employeeId.trim()) {
      toast.error("Employee ID is required");
      return false;
    }

    if (!form.basicSalary) {
      toast.error("Basic salary is required");
      return false;
    }

    const basic = Number(form.basicSalary);
    const allowance = Number(form.allowance || 0);
    const deductions = Number(form.deductions || 0);

    if (Number.isNaN(basic) || basic < 0) {
      toast.error("Basic salary must be a non-negative number");
      return false;
    }

    if (Number.isNaN(allowance) || allowance < 0) {
      toast.error("Allowance must be a non-negative number");
      return false;
    }

    if (Number.isNaN(deductions) || deductions < 0) {
      toast.error("Deductions must be a non-negative number");
      return false;
    }

    return true;
  };

  // -------------------------------------------------------------------
  // Handle submit: call backend /salary/save
  // -------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        employee: selectedEmployeeId, // Employee _id
        department: form.department, // Department _id
        employeeId: form.employeeId, // Human-readable employee code
        basicSalary: Number(form.basicSalary),
        allowance: Number(form.allowance || 0),
        deductions: Number(form.deductions || 0),
        payDate: form.payDate || null, // optional
      };

      const res = await API.post("/salary/addSalary", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Salary saved successfully");
        // redirect to salary list or wherever you want
        navigate("/admin-dashboard/salary");
      } else {
        toast.error(res.data.error || "Failed to save salary");
      }
    } catch (err) {
      console.error("Error saving salary:", err);
      toast.error(
        err?.response?.data?.error || "Server error while saving salary"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700">
          Loading salary form...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto mt-25 bg-gray-200 p-8 rounded-md shadow-md w-182">
      <div className="mb-5 text-center pb-3">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Add Salary</h2>
        <p className="text-sm text-gray-500">
          Please fill in all required fields (*)
        </p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        {/* Department */}
        <div className="flex flex-col">
          <label
            htmlFor="department"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Department *
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col">
          <label
            htmlFor="employee"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Employee *
          </label>
          <select
            name="employee"
            value={selectedEmployeeId}
            onChange={handleChange}
            disabled={!form.department}
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {form.department ? "Select employee" : "Select department first"}
            </option>
            {filteredEmployees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.userId?.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        {/* Name (read-only) */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            readOnly
            placeholder="Employee name"
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none"
          />
        </div>

        {/* Employee ID (read-only) */}
        <div className="flex flex-col">
          <label
            htmlFor="employeeId"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Employee ID *
          </label>
          <input
            type="text"
            name="employeeId"
            value={form.employeeId}
            readOnly
            placeholder="EMP-001"
            required
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none"
          />
        </div>

        {/* Designation (auto-filled, but editable) */}
        <div className="flex flex-col">
          <label
            htmlFor="designation"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Software Engineer"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Basic Salary */}
        <div className="flex flex-col">
          <label
            htmlFor="basicSalary"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Basic Salary *
          </label>
          <input
            type="number"
            name="basicSalary"
            value={form.basicSalary}
            onChange={handleChange}
            min={0}
            step="1"
            placeholder="e.g., 60000"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Allowance */}
        <div className="flex flex-col">
          <label
            htmlFor="allowance"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Allowance
          </label>
          <input
            type="number"
            name="allowance"
            value={form.allowance}
            onChange={handleChange}
            min={0}
            step="1"
            placeholder="e.g., 5000"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Deductions */}
        <div className="flex flex-col">
          <label
            htmlFor="deductions"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Deductions
          </label>
          <input
            type="number"
            name="deductions"
            value={form.deductions}
            onChange={handleChange}
            min={0}
            step="1"
            placeholder="e.g., 2000"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pay Date */}
        <div className="flex flex-col">
          <label
            htmlFor="payDate"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Pay Date
          </label>
          <input
            type="date"
            name="payDate"
            value={form.payDate}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/salary")}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm text-white font-medium shadow-sm hover:bg-gray-700 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Add Salary"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSalary;
