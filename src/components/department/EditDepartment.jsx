import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dept_name: "",
    head: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await API.get(`/department/${id}`, { headers });
        if (!res.data?.success) {
          toast.error("Failed to load department");
          return;
        }
        const d = res.data.department;
        setForm({
          dept_name: d.dept_name ?? "",
          dept_head: d.dept_head ?? "",
          description: d.description ?? "",
        });
      } catch (err) {
        toast.error(err.response?.data?.error || "Error loading department");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.dept_name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      setSaving(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const res = await API.put(`/department/${id}`, form, { headers });
      if (res.data?.success) {
        toast.success("Department updated");
        navigate("/admin-dashboard/departments");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Update error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-200 p-8 rounded-md shadow-md w-132">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit Department</h2>
        <Link
          to="/admin-dashboard/departments"
          className="text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-800 text-white"
        >
          Back
        </Link>
      </div>
      <form onSubmit={onSubmit}>
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
            value={form.dept_name}
            placeholder="e.g., Engineering"
            onChange={onChange}
            className="mt-1 p-2 py-1 w-full border border-gray-300 rounded-md bg-white "
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="dept_head"
            className="text-sm font-medium text-gray-700"
          >
            Head
          </label>
          <input
            type="text"
            name="dept_head"
            value={form.dept_head}
            placeholder="e.g., Jane Doe"
            onChange={onChange}
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
            value={form.description}
            placeholder="Optional notes…"
            onChange={onChange}
            className="mt-1 p-2  w-full border border-gray-300 rounded-md bg-white mb-4"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-around gap-2 mt-4">
          <Link
            to="/admin-dashboard/departments"
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;
