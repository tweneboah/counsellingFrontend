import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiMessageCircle,
  FiBook,
  FiCalendar,
  FiUser,
  FiMenu,
  FiLogOut,
  FiX,
  FiHeart,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { Button, Avatar, Dropdown } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

const StudentLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: <FiHome />,
      label: "Dashboard",
      gradient: "from-[#003049] to-[#d62828]",
      emoji: "🏠",
    },
    {
      to: "/chat",
      icon: <FiMessageCircle />,
      label: "AI Counselor",
      gradient: "from-[#d62828] to-[#f77f00]",
      emoji: "🤖",
    },
    {
      to: "/journal",
      icon: <FiBook />,
      label: "Journal",
      gradient: "from-[#f77f00] to-[#fcbf49]",
      emoji: "📝",
    },
    {
      to: "/appointments",
      icon: <FiCalendar />,
      label: "Appointments",
      gradient: "from-[#fcbf49] to-[#f77f00]",
      emoji: "📅",
    },
    {
      to: "/profile",
      icon: <FiUser />,
      label: "Profile",
      gradient: "from-[#003049] to-blue-600",
      emoji: "👤",
    },
  ];

  const userMenuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUser />,
      onClick: () => navigate("/profile"),
    },
    {
      id: "logout",
      label: "Logout",
      icon: <FiLogOut />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#fcbf49]/5 to-[#f77f00]/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-20 w-72 h-72 bg-gradient-to-tr from-[#003049]/5 to-[#d62828]/5 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/80 backdrop-blur-md shadow-xl z-20 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="flex-shrink-0 flex items-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#003049] to-[#d62828] rounded-xl flex items-center justify-center shadow-lg">
                  <FiHeart className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#003049] to-[#d62828] bg-clip-text text-transparent">
                    CampusCare
                  </span>
                  <div className="text-xs text-gray-500 font-medium">
                    Your wellness companion
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 bg-gradient-to-r ${link.gradient} rounded-xl`}
                            initial={false}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center">
                          <span className="mr-2 text-lg">{link.emoji}</span>
                          <span className="mr-1">{link.icon}</span>
                          {link.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* User Menu & Mobile Button */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Dropdown
                  trigger={
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-white/50 rounded-xl px-3 py-2 hover:bg-white/70 transition-all duration-200 border border-white/20 shadow-sm"
                    >
                      <Avatar
                        src={currentUser?.profilePicture}
                        alt={currentUser?.fullName}
                        initials={currentUser?.fullName}
                        size="sm"
                        className="mr-3 ring-2 ring-[#fcbf49]/50"
                      />
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {currentUser?.fullName?.split(" ")[0]}
                        </div>
                        <div className="text-xs text-gray-500">Student</div>
                      </div>
                    </motion.button>
                  }
                  items={userMenuItems}
                  align="right"
                />
              </motion.div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-[#f77f00] hover:bg-white/50 transition-colors"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 overflow-hidden"
              id="mobile-menu"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3 text-xl">{link.emoji}</span>
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="border-t border-gray-200 pt-4 mt-4"
                >
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="mr-3" />
                    Logout
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative bg-gradient-to-r from-[#003049] via-[#d62828] to-[#f77f00] text-white py-6 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FiHeart className="w-5 h-5 text-[#fcbf49]" />
              <span className="text-sm font-medium">
                &copy; {new Date().getFullYear()} CampusCare - Your mental
                wellness journey starts here
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-1"
              >
                <FiShield className="w-4 h-4 text-[#fcbf49]" />
                <span>Secure & Confidential</span>
              </motion.div>
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4 text-[#fcbf49]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default StudentLayout;
