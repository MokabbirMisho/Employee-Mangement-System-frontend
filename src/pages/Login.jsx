// import { useEffect, useState } from "react";
// import API from "../utils/api.js";
// import { useAuth } from "../store/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [rememberMe, setRememberMe] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // Load saved values on first mount
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("saved_email");
//     const savedPassword = localStorage.getItem("saved_password");

//     if (savedEmail) setEmail(savedEmail);
//     if (savedPassword) setPassword(savedPassword);
//     if (savedEmail || savedPassword) setRememberMe(true);
//   }, []);

//   // Save as the user types when remember is on
//   const onEmailChange = (e) => {
//     const v = e.target.value;
//     setEmail(v);
//     if (rememberMe) localStorage.setItem("saved_email", v);
//   };

//   const onPasswordChange = (e) => {
//     const v = e.target.value;
//     setPassword(v);
//     if (rememberMe) localStorage.setItem("saved_password", v);
//   };

//   // Toggle remember: clear if turning off, persist current if turning on
//   const toggleRemember = () => {
//     const next = !rememberMe;
//     setRememberMe(next);
//     if (!next) {
//       localStorage.removeItem("saved_email");
//       localStorage.removeItem("saved_password");
//     } else {
//       if (email) localStorage.setItem("saved_email", email);
//       if (password) localStorage.setItem("saved_password", password);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await API.post("/auth/login", { email, password });

//       if (response.data.success) {
//         // persist creds if remember is on
//         if (rememberMe) {
//           localStorage.setItem("saved_email", email);
//           localStorage.setItem("saved_password", password);
//         }

//         login(response.data.user);
//         localStorage.setItem("token", response.data.token);

//         if (response.data.user.role === "admin") {
//           navigate("/admin-dashboard");
//         } else {
//           navigate("/employee-dashboard");
//         }
//       } else {
//         setError(response.data.message || "Login failed");
//       }
//     } catch (error) {
//       const msg =
//         error?.response?.data?.message ||
//         error?.response?.statusText ||
//         "server error. please try again later";
//       setError(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-lg">
//         <h1 className="text-3xl font-lobster text-teal-600 text-center mb-10">
//           Welcome to EMS Admin Panel
//         </h1>

//         <div className="bg-white shadow-xl rounded-2xl p-8">
//           <h1 className="text-xl font-semibold text-gray-700 text-center mb-6">
//             Login to your account
//           </h1>

//           {error && (
//             <div className="mb-4 text-red-600 text-center">{error}</div>
//           )}

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 autoComplete="username"
//                 placeholder="you@example.com"
//                 className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400
//                            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
//                 onChange={onEmailChange}
//                 required
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <a href="#" className="text-sm text-gray-900 hover:underline">
//                   Forgot password?
//                 </a>
//               </div>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 autoComplete="current-password"
//                 required
//                 placeholder="••••••••"
//                 className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400
//                            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
//                 onChange={onPasswordChange}
//               />
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="remember"
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={toggleRemember}
//                 className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
//               />
//               <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
//                 Remember me
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full rounded-xl bg-teal-600 py-3 text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900"
//             >
//               login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// -----------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import API from "../utils/api.js";
import { useAuth } from "../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [accounts, setAccounts] = useState([]); // saved {email, password} from previous logins
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved accounts + remember-me credentials on mount
  useEffect(() => {
    const savedAcc = JSON.parse(localStorage.getItem("saved_accounts") || "[]");
    setAccounts(savedAcc);

    const savedEmail = localStorage.getItem("saved_email");
    const savedPassword = localStorage.getItem("saved_password");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedEmail || savedPassword) setRememberMe(true);
  }, []);

  // Filter suggestions based on what user typed
  const filteredAccounts = useMemo(() => {
    if (!email.trim()) return accounts;
    return accounts.filter((acc) =>
      acc.email.toLowerCase().includes(email.toLowerCase())
    );
  }, [accounts, email]);

  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (rememberMe) localStorage.setItem("saved_email", v);
    setShowSuggestions(true);
  };

  const onPasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    if (rememberMe) localStorage.setItem("saved_password", v);
  };

  const toggleRemember = () => {
    const next = !rememberMe;
    setRememberMe(next);

    if (!next) {
      localStorage.removeItem("saved_email");
      localStorage.removeItem("saved_password");
    } else {
      if (email) localStorage.setItem("saved_email", email);
      if (password) localStorage.setItem("saved_password", password);
    }
  };

  // When clicking on a suggestion (email)
  const handleSelectAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);

    if (rememberMe) {
      localStorage.setItem("saved_email", acc.email);
      localStorage.setItem("saved_password", acc.password);
    }

    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await API.post("/auth/login", { email, password });

      if (response.data.success) {
        // Save / update this account in saved_accounts
        const updated = [...accounts];
        const index = updated.findIndex((acc) => acc.email === email);

        if (index !== -1) {
          updated[index].password = password;
        } else {
          updated.push({ email, password });
        }

        localStorage.setItem("saved_accounts", JSON.stringify(updated));
        setAccounts(updated);

        // Remember me
        if (rememberMe) {
          localStorage.setItem("saved_email", email);
          localStorage.setItem("saved_password", password);
        }

        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        "server error. please try again later";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-lobster text-teal-600 text-center mb-10">
          Welcome to EMS Admin Panel
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Login to your account
          </h1>

          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email + suggestions */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="off"
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                onChange={onEmailChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // small delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                required
              />

              {/* Suggestions dropdown (no extra field, just under email input) */}
              {showSuggestions && filteredAccounts.length > 0 && (
                <div className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg text-sm">
                  {filteredAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      // use onMouseDown to avoid blur before click fires
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectAccount(acc);
                      }}
                    >
                      {acc.email}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a href="#" className="text-sm text-gray-900 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                onChange={onPasswordChange}
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={toggleRemember}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
