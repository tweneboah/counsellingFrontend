import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiMenu,
  FiLogOut,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiActivity,
  FiShield,
  FiBook,
} from "react-icons/fi";
import { Avatar, Dropdown } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  // Define navigation links based on user role
  const navLinks = [
    { 
      to: "/admin", 
      icon: <FiHome size={20} />, 
      label: "Dashboard",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      to: "/admin/students",
      icon: <FiUsers size={20} />,
      label: "Students",
      color: "text-green-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    {
      to: "/admin/chat-sessions",
      icon: <FiMessageCircle size={20} />,
      label: "Chat Sessions",
      color: "text-[#fcbf49]",
      bgColor: "bg-yellow-50",
      hoverColor: "hover:bg-yellow-100"
    },
    {
      to: "/admin/appointments",
      icon: <FiCalendar size={20} />,
      label: "Appointments",
      color: "text-[#f77f00]",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100"
    },

    {
      to: "/admin/journals",
      icon: <FiBook size={20} />,
      label: "Journals",
      color: "text-[#003049]",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
  ];

  // Add admin-only links
  if (userRole === "admin") {
    navLinks.push({
      to: "/admin/counselors",
      icon: <FiShield size={20} />,
      label: "Counselors",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    });
  }

  const userMenuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <FiUsers />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      id: "logout",
      label: "Logout",
      icon: <FiLogOut />,
      onClick: handleLogout,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const SidebarLink = ({ link, mobile = false }) => (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        `group relative flex items-center transition-all duration-200 ease-in-out rounded-xl ${
          mobile ? "px-4 py-3 text-base" : sidebarOpen ? "px-4 py-3 text-sm mx-2" : "justify-center py-3 mx-2"
        } ${
          isActive
            ? `${link.bgColor} ${link.color} shadow-lg transform scale-105`
            : `text-gray-600 ${link.hoverColor} hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105`
        }`
      }
      end={link.to === "/admin"}
      title={!sidebarOpen && !mobile ? link.label : ""}
      onClick={mobile ? toggleMobileMenu : undefined}
    >
      <motion.div 
        className={`${mobile || sidebarOpen ? "mr-3" : ""} ${isActive ? link.color : "text-gray-500"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {link.icon}
      </motion.div>
      {(mobile || sidebarOpen) && (
        <span className="font-medium">{link.label}</span>
      )}
      {isActive && (
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#003049] to-[#d62828] rounded-l-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-r from-[#003049] to-[#d62828] shadow-xl z-20 h-16 fixed w-full"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 flex justify-between items-center h-full">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <motion.button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 mr-3"
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

            {/* Logo */}
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#fcbf49] to-[#f77f00] rounded-lg flex items-center justify-center shadow-lg">
                <FiActivity className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">CampusCare</span>
              <span className="ml-2 text-sm font-medium text-white/70 hidden md:inline">Admin</span>
            </motion.div>

            {/* Desktop sidebar toggle */}
            <motion.button
              type="button"
              className="hidden md:block ml-6 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMenu className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <Dropdown
              trigger={
                <motion.button 
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar
                    src={currentUser?.profilePicture}
                    alt={currentUser?.fullName}
                    initials={
                      currentUser?.fullName
                        ? currentUser.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "A"
                    }
                    size="sm"
                    className="ring-2 ring-white/30"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {currentUser?.fullName || "Admin User"}
                    </div>
                    <div className="text-xs text-white/70 capitalize">
                      {userRole}
                    </div>
                  </div>
                  <FiChevronDown className="hidden md:block text-white/70" />
                </motion.button>
              }
              items={userMenuItems}
              align="right"
            />
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-y-0 left-0 flex flex-col w-80 bg-white shadow-2xl z-40"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Mobile Header */}
            <div className="h-16 flex items-center px-6 bg-gradient-to-r from-[#003049] to-[#d62828]">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#fcbf49] to-[#f77f00] rounded-lg flex items-center justify-center shadow-lg">
                  <FiActivity className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-lg font-bold text-white">Admin Panel</span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto py-6">
              <div className="space-y-2 px-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SidebarLink link={link} mobile={true} />
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-gray-200 p-4">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-base font-medium rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiLogOut className="mr-3 flex-shrink-0" size={20} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:bg-white md:shadow-xl md:pt-16 md:z-10"
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex-1 flex flex-col py-6 overflow-hidden">
          {/* Sidebar Header */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="px-6 pb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <p className="text-sm text-gray-500">Manage your platform</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 px-2">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarLink link={link} />
              </motion.div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 pt-4 px-2">
            <motion.button
              onClick={handleLogout}
              className={`group flex items-center w-full py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${
                sidebarOpen ? "px-4" : "justify-center"
              }`}
              title={!sidebarOpen ? "Logout" : ""}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLogOut
                className={`${sidebarOpen ? "mr-3" : ""} transition-transform group-hover:scale-110`}
                size={20}
              />
              {sidebarOpen && "Logout"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:transition-all md:duration-300 md:ease-in-out md:ml-20 lg:ml-64">
        <div 
          className="md:transition-all md:duration-300 md:ease-in-out"
          style={{ 
            marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? (sidebarOpen ? 0 : 64) 
              : 0 
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
