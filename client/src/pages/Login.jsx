import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../config/server";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthLayout from "../components/common/AuthLayout";

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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Carverse account."
      footer={
        <>
          <span>Don&apos;t have an account?</span>
          <Link
            to="/signup"
            state={from ? { from } : undefined}
            className="font-semibold text-ink underline underline-offset-4 decoration-brand decoration-2 hover:decoration-ink ml-1"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-brand w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
