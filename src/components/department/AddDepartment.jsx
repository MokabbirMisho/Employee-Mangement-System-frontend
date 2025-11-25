import { useState } from "react";
import API from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dept_name: "",
    dept_head: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await API.post("/department/add", department, { headers });

      if (res.data.success) {
        toast.success("Department added successfully");
        setTimeout(() => navigate("/admin-dashboard/departments"), 1000);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-200 p-8 rounded-md shadow-md w-132">
      <h3 className="text-2xl font-bold mb-6 text-center">Add Department</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="dept_name"
            className="text-sm font-medium text-gray-700"
          >
            Department Name
          </label>
          <input
            type="text"
            name="dept_name"
            value={department.dept_name}
            placeholder="Enter Department Name"
            onChange={handleChange}
            className="mt-1 p-2 py-1 w-full border border-gray-300 rounded-md bg-white "
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="dept_head"
            className="text-sm font-medium text-gray-700"
          >
            Department Head
          </label>
          <input
            type="text"
            name="dept_head"
            value={department.dept_head}
            placeholder="Enter Department Name"
            onChange={handleChange}
            className="mt-1 p-2 py-1 w-full border border-gray-300 rounded-md bg-white "
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            placeholder="About the department"
            onChange={handleChange}
            className="mt-1 p-2  w-full border border-gray-300 rounded-md bg-white"
            rows="4"
          ></textarea>
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-4  mt-2">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/departments")}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm text-white font-medium shadow-sm hover:bg-gray-700 focus:outline-none  "
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none "
          >
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
