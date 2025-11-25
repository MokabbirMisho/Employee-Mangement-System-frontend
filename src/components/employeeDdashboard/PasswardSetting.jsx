import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import toast from "react-hot-toast";
import { useAuth } from "../../store/AuthContext.jsx";

const PasswardSetting = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ we’ll use this after success

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Confirm password does not match");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("New password should be different from old password");
      return;
    }

    try {
      setSubmitting(true);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const res = await API.post(
        "/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        { headers }
      );

      if (res.data.success) {
        // ✅ success message
        toast.success("Password changed successfully. Please log in again.");

        // clear form fields
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        // ✅ auto logout + redirect after a short delay
        setTimeout(() => {
          logout(); // clears user + token (as you implemented)
          navigate("/login"); // go to login page
        }, 1500);
      } else {
        toast.error(res.data.error || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(
        err?.response?.data?.error || "Server error while changing password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-100 shadow rounded-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1 text-center">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Update your account password securely
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-teal-700 disabled:opacity-60 transition-colors duration-200"
            >
              {submitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswardSetting;
