import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "../store/userStore";
import { AuthService } from "../services/authService";

export default function Profile() {
  const user = useUserStore((state) => state.auth?.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-8 text-gray-600">Loading profile...</div>;

  

  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    try {
      setLoading(true);
      await AuthService.updatePassword({
        userId: user.id,
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Profile
        </h2>

        {/* User Info Section */}
        <div className="flex flex-col items-center mb-6">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 mb-3"
            />
          )}
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.username}
          </p>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          {user.phone && (
            <p className="text-gray-600 dark:text-gray-300">📱 {user.phone}</p>
          )}
        </div>

        {/* Change Password Section */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white text-center">
            Change Password
          </h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded border dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
