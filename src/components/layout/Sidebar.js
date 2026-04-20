import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  ClipboardList,
  Map,
  Settings,
  LogOut,
  Heart,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const isPlatformAdmin = user?.roles?.includes("platform_admin");
  const isInstitutionAdmin = user?.roles?.includes("institution_admin");
  const isApprovedVolunteer =
    user?.roles?.includes("volunteer") || user?.volunteer_status === "approved";

  const hasVolunteerApplication =
    user?.wants_volunteer ||
    user?.volunteer_status === "pending" ||
    user?.volunteer_status === "rejected" ||
    user?.volunteer_status === "approved";

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/requests", label: "Pedidos de Ajuda", icon: ClipboardList },
    { path: "/map", label: "Mapa", icon: Map },
  ];

  if (hasVolunteerApplication || !isApprovedVolunteer) {
    navItems.push({
      path: "/volunteer/documents",
      label: "A minha candidatura",
      icon: BadgeCheck,
    });
  }

  if (isApprovedVolunteer || isPlatformAdmin || isInstitutionAdmin) {
    navItems.push({
      path: "/volunteers",
      label: "Voluntários",
      icon: Heart,
    });
  }

  if (isPlatformAdmin) {
    navItems.push(
      {
        path: "/admin/users",
        label: "Administração",
        icon: Settings,
      },
      {
        path: "/admin/documents",
        label: "Documentos",
        icon: FileText,
      }
    );
  }

  const roleLabels = {
    platform_admin: "Super Admin",
    institution_admin: "Entidade",
    volunteer: "Voluntário",
    requester: "Requerente",
  };

  const roleOrder = [
    "platform_admin",
    "institution_admin",
    "volunteer",
    "requester",
  ];

  const roleLabel =
    user?.roles?.length
      ? roleOrder
          .filter((role) => user.roles.includes(role))
          .map((role) => roleLabels[role] || role)
          .join(" · ")
      : "Utilizador";

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="border-b border-slate-200 p-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            CivicShield
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;