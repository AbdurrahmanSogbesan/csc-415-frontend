import { ReactNode, useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router";
import MainLayout from "./MainLayout";
import { AuthRoutes } from "@/app/auth";
import Home from "@/app/home";
import { useAuthStore } from "@/lib/stores/auth";
import Settings from "@/app/settings";
import { RateLecturers } from "@/app/rate-lecturers";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";

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
        <Route path="rate-lecturers" element={<RateLecturers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
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

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-xl text-muted-foreground">Oops! Page not found</p>
      <Separator className="my-4 h-1 w-24 rounded bg-primary" />
      <p className="mb-6 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
