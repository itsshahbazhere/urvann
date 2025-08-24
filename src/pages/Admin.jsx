import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

/**
 * Eco-friendly Admin Login Page (with react-hook-form)
 */
const Admin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASEURL;

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/admin`, data);
      if (res.status === 200 && res.data.success) {
        // Set token in localStorage
        localStorage.setItem("admin_token", res.data.token);
        toast.success("Login successful!");
        navigate("/plant");
      } else {
        toast.error(res.data.message || "Login failed. Please try again.");
        setError("root", { message: res.data.message || "Login failed." });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed. Please try again."
      );
      setError("root", {
        message: err?.response?.data?.message || "Login failed.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-lime-100">
      <div className="w-11/12 max-w-md p-8 bg-white/80 rounded-3xl shadow-2xl border-2 border-green-200 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" fill="#bbf7d0" />
            <path
              d="M30 43c7-4 12-9 12-15 0-5.523-4.477-10-10-10s-10 4.477-10 10c0 6 5 11 12 15z"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="2"
            />
            <circle
              cx="30"
              cy="25"
              r="4"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="2"
            />
          </svg>
          <h2 className="mt-3 text-3xl font-extrabold text-green-900 tracking-tight drop-shadow-sm">
            Admin Login
          </h2>
          <p className="text-green-700 mt-1 text-sm font-medium">
            Eco-friendly dashboard access
          </p>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              className="block text-green-900 font-semibold mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email", { required: "email is required" })}
              type="text"
              autoComplete="email"
              className="w-full px-4 py-2 rounded-xl border-2 border-green-200 bg-green-50 text-green-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your admin email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-red-600 font-medium text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="block text-green-900 font-semibold mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-xl border-2 border-green-200 bg-green-50 text-green-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 text-sm focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M2 2l16 16M10 4.5c-4 0-7.5 2.91-8.5 6.5a8.96 8.96 0 0012.12 4.25M10 15.5c4 0 7.5-2.91 8.5-6.5A8.96 8.96 0 007.88 4.75"
                      stroke="#15803d"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M1 10s3.5-5.5 9-5.5 9 5.5 9 5.5-3.5 5.5-9 5.5S1 10 1 10z"
                      stroke="#15803d"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      stroke="#15803d"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-600 font-medium text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          {errors.root && (
            <div className="text-red-600 font-medium">
              {errors.root.message}
            </div>
          )}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-green-600 to-lime-600 text-white py-2.5 rounded-xl font-bold shadow hover:from-green-700 hover:to-lime-700 transition-all tracking-wide uppercase ring-2 ring-green-200 hover:ring-green-400 focus:outline-none focus:ring-4 focus:ring-green-600/40 ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            } flex items-center justify-center gap-2`}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <NavLink
          to="/"
          className="flex items-center gap-2 mt-6 text-green-700 font-semibold hover:underline transition"
          title="Back to Home"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to Home</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Admin;
