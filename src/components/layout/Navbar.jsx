import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiCalendar,
  FiBook,
  FiHeart,
  FiZap,
  FiUsers,
  FiHome,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const publicNavLinks = [{ to: "/", label: "Home", icon: <FiHome /> }];

  const studentNavLinks =
    isLoggedIn && userRole === "student"
      ? [
          { to: "/dashboard", label: "Dashboard", icon: <FiUser /> },
          { to: "/chat", label: "AI Counselor", icon: <FiMessageSquare /> },
          { to: "/journal", label: "Journal", icon: <FiBook /> },
          { to: "/appointments", label: "Appointments", icon: <FiCalendar /> },
        ]
      : [];

  const adminNavLinks =
    isLoggedIn && (userRole === "counselor" || userRole === "admin")
      ? [
          { to: "/admin", label: "Dashboard", icon: <FiUser /> },
          {
            to: "/admin/appointments",
            label: "Appointments",
            icon: <FiCalendar />,
          },
          { to: "/admin/students", label: "Students", icon: <FiUsers /> },
        ]
      : [];

  const allNavLinks = [...publicNavLinks, ...studentNavLinks, ...adminNavLinks];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-white via-white to-gray-50 shadow-lg backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="flex-shrink-0 flex items-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#003049] to-[#d62828] rounded-xl flex items-center justify-center shadow-lg mr-3">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <motion.span
                  className="text-2xl font-bold bg-gradient-to-r from-[#003049] to-[#d62828] bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  CampusCare
                </motion.span>
                <div className="text-xs text-gray-500 font-medium -mt-1">
                  Your wellness companion
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {allNavLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className="group relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-[#003049] hover:bg-gradient-to-r hover:from-[#f77f00]/10 hover:to-[#fcbf49]/10"
                >
                  <span className="mr-2 text-lg group-hover:scale-110 transition-transform">
                    {link.icon}
                  </span>
                  {link.label}
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] group-hover:w-full transition-all duration-300"
                    layoutId={`underline-${link.to}`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                {/* User Info */}
                <motion.div
                  className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[#003049]">
                      {currentUser?.fullName || "User"}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {userRole}
                    </div>
                  </div>
                </motion.div>

                {/* Profile Link */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to="/profile"
                    className="p-3 rounded-xl bg-gradient-to-r from-[#f77f00]/10 to-[#fcbf49]/10 text-[#f77f00] hover:from-[#f77f00]/20 hover:to-[#fcbf49]/20 hover:text-[#d62828] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FiUser className="h-5 w-5" />
                  </Link>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-[#d62828]/10 to-red-500/10 text-[#d62828] hover:from-[#d62828]/20 hover:to-red-500/20 hover:text-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FiLogOut className="h-5 w-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-6 py-3 text-sm font-semibold text-[#003049] hover:text-[#d62828] transition-colors duration-300 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white"
                  >
                    Sign in
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#fcbf49] hover:to-[#f77f00] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  >
                    <FiZap className="mr-2 w-4 h-4" />
                    Get Started
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register-admin"
                    className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#003049] to-[#d62828] hover:from-[#d62828] hover:to-[#003049] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  >
                    <FiStar className="mr-2 w-4 h-4" />
                    Admin
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-[#003049] hover:bg-gradient-to-r hover:from-[#f77f00]/10 hover:to-[#fcbf49]/10 transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="block h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="block h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-gradient-to-br from-white to-gray-50 backdrop-blur-md border-t border-gray-200/50 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Navigation Links */}
              {allNavLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Link
                    to={link.to}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-[#003049] hover:bg-gradient-to-r hover:from-[#f77f00]/10 hover:to-[#fcbf49]/10 transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <span className="mr-3 text-xl">{link.icon}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200/50 px-4 py-6">
              {isLoggedIn ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {/* User Info Mobile */}
                  <div className="flex items-center px-4 py-3 mb-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mr-4">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[#003049]">
                        {currentUser?.fullName || "User"}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {userRole} • {currentUser?.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-[#003049] hover:bg-gradient-to-r hover:from-[#f77f00]/10 hover:to-[#fcbf49]/10 rounded-xl transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      <FiUser className="mr-3 h-5 w-5" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-[#d62828] hover:text-red-600 hover:bg-gradient-to-r hover:from-[#d62828]/10 hover:to-red-500/10 rounded-xl transition-all duration-200"
                    >
                      <FiLogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="space-y-3"
                >
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-6 py-3 text-base font-semibold text-[#003049] hover:text-[#d62828] bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 rounded-xl border border-gray-200 transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <FiUser className="mr-2 w-5 h-5" />
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#fcbf49] hover:to-[#f77f00] rounded-xl shadow-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <FiZap className="mr-2 w-5 h-5" />
                    Get Started
                  </Link>

                  <Link
                    to="/register-admin"
                    className="flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-[#003049] to-[#d62828] hover:from-[#d62828] hover:to-[#003049] rounded-xl shadow-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <FiStar className="mr-2 w-5 h-5" />
                    Register as Admin
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
