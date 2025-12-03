import React from "react";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-[Inter] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="text-blue-600 w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              AutoNext
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Sign In to AutoNext
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end text-sm">
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-700 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="text-white w-full py-3.5 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200/50"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <span>Don&apos;t have an account?</span>
          <Link to="/signup"
            className="font-semibold text-blue-700 hover:text-blue-800 transition ml-1"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
