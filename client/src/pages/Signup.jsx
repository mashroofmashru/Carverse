import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../config/server";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthLayout from "../components/common/AuthLayout";

const MIN_PASSWORD = 6;

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");
  const [isDealer, setIsDealer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Password !== ConfPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/signup", {
        Name,
        Email,
        Password,
        role: isDealer ? "dealer" : "user",
      });

      if (res.data.success) {
        const { user, token } = res.data;
        login(user, token);
        if (user.role === "admin") navigate("/admin", { replace: true });
        else if (user.role === "dealer") navigate("/dealer/approval", { replace: true });
        else navigate(from || "/", { replace: true });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Carverse to buy or sell cars."
      footer={
        <>
          <span>Already have an account?</span>
          <Link
            to="/login"
            state={from ? { from } : undefined}
            className="font-semibold text-ink underline underline-offset-4 decoration-brand decoration-2 hover:decoration-ink ml-1"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            autoComplete="name"
            className="field"
            placeholder="Your name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            required
            autoComplete="email"
            className="field"
            placeholder="you@example.com"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete="new-password"
              aria-describedby="password-hint"
              className="field"
              placeholder="••••••••"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={MIN_PASSWORD}
              autoComplete="new-password"
              className="field"
              placeholder="••••••••"
              value={ConfPassword}
              onChange={(e) => setConfPassword(e.target.value)}
            />
          </div>
        </div>
        <p id="password-hint" className="-mt-2 text-xs text-gray-600">
          At least {MIN_PASSWORD} characters.
        </p>

        <div>
          <label htmlFor="dealer" className="flex items-center gap-3 cursor-pointer text-sm text-ink">
            <input
              type="checkbox"
              id="dealer"
              checked={isDealer}
              onChange={(e) => setIsDealer(e.target.checked)}
              className="h-5 w-5 shrink-0 rounded accent-black cursor-pointer"
            />
            Sign up as a dealer
          </label>
          {isDealer && (
            <p className="mt-2 pl-8 text-xs text-gray-600">
              Dealer accounts need approval. After signing up you'll submit your dealership details for review.
            </p>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-brand w-full">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;
