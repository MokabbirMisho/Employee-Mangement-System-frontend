import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const UpdateEmployee = () => {
  const { id } = useParams(); // employee _id from URL
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true); // loading initial data
  const [submitting, setSubmitting] = useState(false); // submitting form

  const [existingAvatar, setExistingAvatar] = useState(null); // filename from backend

  const navigate = useNavigate();

  // unified form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    // password: "", // optional on update
    role: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    avatar: null, // new file
  });

  // Fetch departments + employee details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // Fetch departments and employee in parallel
        const [deptRes, empRes] = await Promise.all([
          API.get("/department", { headers }),
          API.get(`/employee/${id}`, { headers }),
        ]);

        // Departments
        if (deptRes.data.success) {
          setDepartments(deptRes.data.departments || []);
        } else {
          toast.error(deptRes.data.error || "Failed to load departments");
        }

        // Employee
        if (empRes.data.success) {
          const emp = empRes.data.employee;
          const user = emp.userId;
          const dept = emp.department;

          setForm({
            name: user?.name || "",
            email: user?.email || "",
            // password: "", // leave empty -> keep old password
            role: user?.role || "employee",
            employeeId: emp.employeeId || "",
            dob: emp.dob ? emp.dob.slice(0, 10) : "",
            gender: emp.gender || "",
            maritalStatus: emp.maritalStatus || "",
            designation: emp.designation || "",
            department: dept?._id || "",
            salary: typeof emp.salary === "number" ? String(emp.salary) : "",
            avatar: null, // new file (optional)
          });

          setExistingAvatar(user?.avatar || null);
        } else {
          toast.error(empRes.data.error || "Failed to load employee");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.error || "Error loading employee / departments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      setForm((f) => ({ ...f, avatar: files?.[0] || null }));
      return;
    }

    if (name === "employeeId") {
      setForm((f) => ({ ...f, employeeId: value.toUpperCase() }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // Simple validation (password optional on update)
  const validate = () => {
    const required = [
      ["name", "Name is required"],
      ["email", "Email is required"],
      ["role", "Role is required"],

      ["department", "Department is required"],
    ];

    for (const [k, msg] of required) {
      if (!String(form[k]).trim()) {
        toast.error(msg);
        return false;
      }
    }

    return true;
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        // ✅ do NOT send these – they should not be updated
        if (k === "employeeId" || k === "salary" || k === "password") return;

        if (v !== null && v !== "") fd.append(k, v);
      });

      const res = await API.put(`/employee/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Employee updated");
        navigate("/admin-dashboard/employees");
      } else {
        toast.error(res.data?.error || "Failed to update employee");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error || "Server error while updating employee"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-bars loading-lg text-accent"></span>
        <p className="text-lg font-medium text-gray-700">
          Loading employee data...
        </p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-25 bg-gray-200 p-8 rounded-md shadow-md w-182">
      <div className="mb-5 text-center pb-3">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Update Employee
        </h2>
        <p className="text-sm text-gray-500">
          Update the employee details and save changes.
        </p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {/* Employee ID */}
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
            onChange={handleChange}
            placeholder="001"
            required
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Name */}
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
            onChange={handleChange}
            placeholder="Insert Name"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="employee@example.com"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label
            htmlFor="dob"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label
            htmlFor="gender"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Marital Status */}
        <div className="flex flex-col">
          <label
            htmlFor="maritalStatus"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label
            htmlFor="role"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Role *
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

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

        {/* Designation */}
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

        {/* Salary */}
        <div className="flex flex-col">
          <label
            htmlFor="salary"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Salary *
          </label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            min={0}
            step="1"
            placeholder="e.g., 60000"
            required
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload avatar */}
        <div className="flex flex-col">
          <label
            htmlFor="avatar"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Upload Image (optional)
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm rounded-md border bg-white border-gray-300 text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-gray-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-100 hover:file:bg-gray-200 shadow"
          />
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/employees")}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm text-white font-medium shadow-sm hover:bg-gray-700 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
