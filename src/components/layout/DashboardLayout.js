import React from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-h-screen md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;