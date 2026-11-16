import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";
import api from "../config/server";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition duration-200 shadow-sm";

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Page the user was on before being sent to login (e.g. a car they wanted to buy)
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { Email, Password });

      if (res.data.success) {
        const { user, token } = res.data;
        login(user, token);

        if (user.role === "admin") navigate("/admin", { replace: true });
        else if (user.role === "dealer") {
          navigate(user.status === "approved" ? "/dealer" : "/dealer/approval", { replace: true });
        } else navigate(from || "/", { replace: true });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Car className="text-blue-600 w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">AutoNext</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign In to AutoNext</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="text-white w-full py-3.5 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <span>Don&apos;t have an account?</span>
            <Link
              to="/signup"
              state={from ? { from } : undefined}
              className="font-semibold text-blue-700 hover:text-blue-800 transition ml-1"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
