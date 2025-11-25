import { useState } from "react";
import toast from "react-hot-toast";
import { Settings, ShieldCheck, Building2, Bell, Euro } from "lucide-react";

const AdminSettings = () => {
  // General / organization settings
  const [companyName, setCompanyName] = useState("My Company");
  const [supportEmail, setSupportEmail] = useState("hr@example.com");
  const [defaultLanguage, setDefaultLanguage] = useState("en");

  // Payroll & leave
  const [currency, setCurrency] = useState("EUR");
  const [salaryDay, setSalaryDay] = useState("25"); // 1–31
  const [maxAnnualLeave, setMaxAnnualLeave] = useState(30);

  // Security / access
  const [allowEmployeeProfileEdit, setAllowEmployeeProfileEdit] =
    useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  const [notifyOnLeaveRequest, setNotifyOnLeaveRequest] = useState(true);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    // TODO: call backend API (e.g. /settings/general)
    // await API.put("/settings/general", { companyName, supportEmail, defaultLanguage });
    toast.success("General settings saved");
  };

  const handleSavePayroll = (e) => {
    e.preventDefault();
    // TODO: call backend API (e.g. /settings/payroll)
    // await API.put("/settings/payroll", { currency, salaryDay, maxAnnualLeave });
    toast.success("Payroll & leave settings saved");
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    // TODO: call backend API (e.g. /settings/security)
    // await API.put("/settings/security", { allowEmployeeProfileEdit, sessionTimeout, notifyOnLeaveRequest });
    toast.success("Security & notifications settings saved");
  };

  return (
    <div className="p-4 sm:p-6 h-full bg-base-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Admin Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage organization, payroll, and security preferences
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
            <Settings className="text-teal-600" size={20} />
          </div>
        </div>

        {/* General settings */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-teal-50">
              <Building2 className="text-teal-600" size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Organization & General
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Company identity and basic settings
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveGeneral}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter company name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                HR / Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="hr@example.com"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Default Language
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="bn">Bangla</option>
              </select>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-sm"
              >
                Save General
              </button>
            </div>
          </form>
        </div>

        {/* Payroll & Leave settings */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-yellow-50">
              <Euro className="text-yellow-600" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Payroll & Leave
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Salary display and default leave rules
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSavePayroll}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Salary Payout Day
              </label>
              <select
                value={salaryDay}
                onChange={(e) => setSalaryDay(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Max Annual Leave (days)
              </label>
              <input
                type="number"
                min={0}
                value={maxAnnualLeave}
                onChange={(e) => setMaxAnnualLeave(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-sm"
              >
                Save Payroll & Leave
              </button>
            </div>
          </form>
        </div>

        {/* Security & Notification settings */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-purple-50">
              <ShieldCheck className="text-purple-600" size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Security & Notifications
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Control access and notification preferences
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveSecurity}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Employee Profile Editing
              </label>
              <p className="text-xs text-gray-500">
                Allow employees to edit their own profile information (name,
                avatar, contact info).
              </p>
              <div className="flex items-center gap-3 mt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={allowEmployeeProfileEdit === true}
                    onChange={() => setAllowEmployeeProfileEdit(true)}
                  />
                  <span>Allow</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={allowEmployeeProfileEdit === false}
                    onChange={() => setAllowEmployeeProfileEdit(false)}
                  />
                  <span>Admin only</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Auto Logout (minutes)
              </label>
              <p className="text-xs text-gray-500">
                For security, automatically log out inactive users.
              </p>
              <input
                type="number"
                min={5}
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Bell className="text-amber-500" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  Notify on Leave Request
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Show admin notifications when employees submit new leave
                requests.
              </p>
              <label className="inline-flex items-center gap-2 mt-1 text-sm">
                <input
                  type="checkbox"
                  checked={notifyOnLeaveRequest}
                  onChange={(e) => setNotifyOnLeaveRequest(e.target.checked)}
                />
                <span>Enable leave notifications</span>
              </label>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-sm"
              >
                Save Security & Notifications
              </button>
            </div>
          </form>
        </div>

        {/* System info (read-only) */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            System Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase">App Version</p>
              <p className="font-medium text-gray-800">v1.0.0</p>
            </div>
            <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase">Environment</p>
              <p className="font-medium text-gray-800">Development</p>
            </div>
            <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase">
                Default Timezone
              </p>
              <p className="font-medium text-gray-800">Europe/Berlin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
