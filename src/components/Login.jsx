import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Appointment from "./Appointment";
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ userID: "", password: "" });
  const [errors, setErrors] = useState({
    userID: false,
    password: false,
    login: false,
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate(); // ✅ React Router Navigation

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = { userID: false, password: false, login: false };

    if (!formData.userID.trim()) newErrors.userID = true;
    if (!formData.password || formData.password.length < 6)
      newErrors.password = true;

    setErrors(newErrors);
    if (newErrors.userID || newErrors.password) return;

    // ✅ Mock authentication check
    if (formData.userID === "berry" && formData.password === "berry@123") {
      setLoginSuccess(true);
      setErrors({ ...newErrors, login: false });

      setTimeout(() => {
        navigate("/appointment"); // ✅ Navigate to Appointment Page on success
      }, 1000);
    } else {
      setErrors({ ...newErrors, login: true });
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0b0f2f] to-[#0a0d26] min-h-screen flex items-center justify-center p-4">
      {/* ✅ Clickable Logo (Navigates to Home) */}
      <img
        src="/src/assets/images/OrthoBerry-removebg.png"
        alt="logo"
        className="absolute top-6 left-2 w-[200px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">
          Login to Demo Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userID" className="block text-sm font-medium mb-1">
              User ID
            </label>
            <input
              type="text"
              id="userID"
              value={formData.userID}
              onChange={handleChange}
              placeholder="User ID"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {errors.userID && (
              <p className="text-red-500 text-sm mt-1">User ID is required.</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-9 right-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login Now
          </button>

          {errors.login && (
            <p className="text-red-500 text-sm mt-3">
              Invalid User ID or Password.
            </p>
          )}
          {loginSuccess && (
            <p className="text-green-500 text-sm mt-3">Login successful!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;