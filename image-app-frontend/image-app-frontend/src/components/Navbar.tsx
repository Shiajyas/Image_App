import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Avatar } from "./Avatar";
import { Menu, X } from "lucide-react"; // hamburger & close icons

export default function Navbar() {
  const { auth: user, isAuthenticated } = useUserStore();
  const logout = useUserStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check current path
  const currentPath = location.pathname;

  return (
<nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 
  md:fixed md:top-0 md:left-0 md:right-0 md:z-50">
  {/* App Branding */}
  <div className="text-xl font-bold text-gray-900 dark:text-white">
    <Link to="/">Image App</Link>
  </div>


      {/* Desktop Menu */}
      <div className="hidden md:flex relative items-center space-x-4">
        {isAuthenticated() && user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2"
            >
              <Avatar username={user?.user.avatar ?? ""} className="w-8 h-8" />
              <span className="text-gray-900 dark:text-white">
                {user.user.email}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded shadow-lg">
                    <Link
          to="/upload"
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Upload Images
        </Link>

                <Link
                  to="/change-password"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                  onClick={() => setDropdownOpen(false)}
                >
                 Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {currentPath === "/login" ? (
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Register
              </Link>
            ) : currentPath === "/register" ? (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Login
              </Link>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-900 dark:text-white"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
    {menuOpen && (
  <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-700 rounded shadow-lg md:hidden">
    {isAuthenticated() && user ? (
      <>
        <Link
          to="/upload"
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Upload Images
        </Link>

        <Link
          to="/change-password"
          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Change Password
        </Link>

        <button
          onClick={() => {
            logout();
            setMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        {currentPath === "/login" ? (
          <Link
            to="/register"
            className="block px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded m-2 text-center"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
        ) : (
          <Link
            to="/login"
            className="block px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded m-2 text-center"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </>
    )}
  </div>
)}

    </nav>
  );
}
