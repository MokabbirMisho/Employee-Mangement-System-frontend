import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import API from "../../utils/api.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  // Fetch leave notifications for employee
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const res = await API.get("/leave/my/notifications", { headers });

        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        console.error("notifications error", err);
      }
    };

    if (user && user.role === "employee") {
      fetchNotifications();
    }
  }, [user]);

  // Toggle dropdown + mark as seen
  const handleToggleNotifications = async () => {
    const next = !open;
    setOpen(next);

    if (next && unreadCount > 0 && user?.role === "employee") {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        await API.patch("/leave/my/notifications/mark-seen", {}, { headers });

        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((l) => ({ ...l, isSeenByEmployee: true }))
        );
      } catch (err) {
        console.error("mark seen error", err);
      }
    }
  };

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="w-full bg-gray-100 shadow px-4 py-3 flex items-center justify-between">
      {/* Mobile sidebar toggle */}
      <label
        htmlFor="admin-drawer"
        className="btn btn-square btn-ghost md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>

      {/* Welcome message (center) */}
      <h2 className="font-semibold text-lg text-center flex-1 md:flex-none">
        Welcome, {firstName}
      </h2>

      {/* Right side: notifications (employee only) + logout */}
      <div className="flex items-center gap-3">
        {/* Notifications only for employee role */}
        {user?.role === "employee" && (
          <div className="relative">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-full hover:bg-gray-200"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md border z-50">
                <div className="px-3 py-2 border-b text-sm font-semibold">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-gray-500">
                      No notifications.
                    </div>
                  ) : (
                    notifications.map((leave) => (
                      <div
                        key={leave._id}
                        className="px-3 py-2 text-xs border-b last:border-b-0 bg-gray-50"
                      >
                        <p className="font-semibold">Leave {leave.status}</p>
                        <p className="text-gray-600">
                          {leave.leaveType} from {formatDate(leave.fromDate)} to{" "}
                          {formatDate(leave.toDate)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatDate(leave.updatedAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
