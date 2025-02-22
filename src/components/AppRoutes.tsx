import { ReactNode, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import MainLayout from "./MainLayout";
import { AuthRoutes } from "@/app/auth";
import Home from "@/app/home";
import { useAuthStore } from "@/lib/stores/auth";

// Our auth middleware component
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <Navigate replace to="/auth" state={{ from: location }} />;
  }

  return children;
}

// The pages of the app
function MainRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Navigate replace to={"/"} />} />
        <Route path="rate-lecturers" element={<div>Rate Lecturers</div>} />
        <Route path="settings" element={<div>Settings</div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </MainLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthRoutes />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <MainRoutes />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
