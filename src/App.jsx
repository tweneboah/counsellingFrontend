import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicLayout } from "./components/layout";
import {
  Login,
  Register,
  RegisterAdmin,
  ForgotPassword,
  ResetPassword,
  Unauthorized,
} from "./pages/auth";
import Landing from "./pages/Landing";
import { StudentLayout, AdminLayout } from "./components/layouts";
import {
  Dashboard,
  Chat,
  Journal,
  Appointments,
  RequestAppointment,
  Profile,
} from "./pages/student";
import {
  AdminDashboard,
  CounselorsManagement,
  ChatSessions,
  AppointmentsManagement,
  StudentsManagement,
  JournalsManagement,
  AdminProfile,
} from "./pages/admin";
import { OnboardingWrapper } from "./components/onboarding";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes with navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-admin" element={<RegisterAdmin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            {/* Protected student routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route element={<StudentLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <OnboardingWrapper>
                      <Dashboard />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <OnboardingWrapper>
                      <Chat />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/chat/:chatId"
                  element={
                    <OnboardingWrapper>
                      <Chat />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/journal/*"
                  element={
                    <OnboardingWrapper>
                      <Journal />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <OnboardingWrapper>
                      <Appointments />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/request-appointment"
                  element={
                    <OnboardingWrapper>
                      <RequestAppointment />
                    </OnboardingWrapper>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <OnboardingWrapper>
                      <Profile />
                    </OnboardingWrapper>
                  }
                />
              </Route>
            </Route>

            {/* Protected counselor/admin routes */}
            <Route
              element={<ProtectedRoute allowedRoles={["counselor", "admin"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                  path="/admin/students"
                  element={<StudentsManagement />}
                />
                <Route path="/admin/chat-sessions" element={<ChatSessions />} />
                <Route
                  path="/admin/appointments"
                  element={<AppointmentsManagement />}
                />

                <Route
                  path="/admin/journals"
                  element={<JournalsManagement />}
                />

                {/* Admin-only routes */}
                <Route
                  path="/admin/counselors"
                  element={<CounselorsManagement />}
                />
                <Route
                  path="/admin/settings"
                  element={<div>System Settings</div>}
                />
                <Route
                  path="/admin/profile"
                  element={<AdminProfile />}
                />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
