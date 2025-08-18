import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = ({ allowedRoles, redirectPath = "/login" }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // If roles are specified, check if user has allowed role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export const StudentRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>;
};

export const CounselorRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["counselor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
