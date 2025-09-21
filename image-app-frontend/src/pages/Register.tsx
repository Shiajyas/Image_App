import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthService } from "../services/authService";
import { Avatar } from "../components/Avatar";

const themeOptions = [
  "fun-emoji",
  "pixel-art",
  "avataaars",
  "bottts",
  "identicon",
  "initials",
];

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Generate avatar URL
  const generateAvatarUrl = (seed: string, theme: string = "fun-emoji") =>
    `https://api.dicebear.com/8.x/${theme}/svg?seed=${encodeURIComponent(seed)}`;

  // Update avatar when username changes
  useEffect(() => {
    if (username) {
      const randomTheme =
        themeOptions[Math.floor(Math.random() * themeOptions.length)];
      setAvatarUrl(generateAvatarUrl(username, randomTheme));
    } else {
      setAvatarUrl("");
    }
  }, [username]);

  const retryAvatar = () => {
    if (username) {
      const randomTheme =
        themeOptions[Math.floor(Math.random() * themeOptions.length)];
      const randomSeed =
        username + `-${Math.random().toString(36).substring(2, 5)}`;
      setAvatarUrl(generateAvatarUrl(randomSeed, randomTheme));
      toast.success("Avatar updated!");
    }
  };

  // Validations
  const validateForm = () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      await AuthService.register({
        username,
        email,
        phone,
        password,
        avatar: avatarUrl,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Register
        </h2>

        <div className="flex flex-col items-center mb-4">
          {avatarUrl && (
            <div className="mb-2">
              <Avatar
                username={avatarUrl}
                className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          {username && avatarUrl && (
            <button
              onClick={retryAvatar}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
            >
              Retry Avatar
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded border dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
        >
          Register
        </button>
      </div>
    </div>
  );
}
