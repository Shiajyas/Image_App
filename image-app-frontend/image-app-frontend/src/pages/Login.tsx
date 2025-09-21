import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { AuthService } from "../services/authService";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // 👈 eye icons

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const handleLogin = async () => {
  try {
    const res = await AuthService.login({ email, password });
    setAuth(res.data);

    localStorage.setItem("token", res.data.accessToken);

    toast.success("Login successful!");
    navigate("/");
  } catch (err: any) {
    console.error(err);

    // Safely extract backend error message
    const errorMessage =
      err?.response?.data?.message || "Login failed. Please try again.";

    toast.error(errorMessage);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />

        {/* Password with eye toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-900"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
