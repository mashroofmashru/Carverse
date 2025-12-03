import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import api from '../config/server'
import { useState } from "react";

const SignupPage = () => {
    const navigate=useNavigate();

    // For form inputs
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfPassword, setConfPassword] = useState("");
    const [ErrorMasg, setErrorMsg] = useState("");

    // function for handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(Password!=ConfPassword){
                "Passwords do not match"
            }
            const res = await api.post("/auth/signup", {
                Name,
                Email,
                Password,
            });
            console.log("res:", res.data);

        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
        }
        if(res.status==true){
            <navigate to=""/>
        }
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
                    <h1 className="text-3xl text-gray-900">
                        Create Your AutoNext Account
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="Name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="Name"
                            required
                            autoComplete="Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 shadow-sm"
                            placeholder="youreName"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    {/* Email */}
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            autoComplete="new-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 shadow-sm"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            autoComplete="new-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200 shadow-sm"
                            placeholder="••••••••"
                            onChange={(e) => setConfPassword(e.target.value)}
                        />
                        {ErrorMasg && <p className="text-red-700">{ErrorMasg}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="text-white w-full py-3.5 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200/50"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Switch to Login */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <span>Already have an account?</span>
                    <Link
                        to="/login"
                        className="font-semibold text-blue-700 hover:text-blue-800 transition ml-1"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
