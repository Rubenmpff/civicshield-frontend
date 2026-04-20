import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  Building2,
  Heart,
  User,
  Clock3,
  Ban,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const AdminUsers = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isPlatformAdmin = currentUser?.roles?.includes("platform_admin");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map((profile) => {
        const roles =
          rolesData
            ?.filter((roleRow) => roleRow.user_id === profile.id)
            .map((roleRow) => roleRow.role) || [];

        return {
          ...profile,
          roles,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar utilizadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlatformAdmin) {
      fetchUsers();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isPlatformAdmin, authLoading]);

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!isPlatformAdmin) {
      toast.error("Não tens permissão para esta ação.");
      return;
    }

    try {
      setActionLoadingId(userId);

      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast.success(
        currentStatus ? "Utilizador desativado." : "Utilizador ativado."
      );

      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar utilizador.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePromoteToInstitutionAdmin = async (userId) => {
    if (!isPlatformAdmin) {
      toast.error("Não tens permissão para esta ação.");
      return;
    }

    if (userId === currentUser?.id) {
      toast.error("Não te podes promover a ti próprio.");
      return;
    }

    try {
      setActionLoadingId(userId);

      const { error } = await supabase.from("user_roles").upsert(
        {
          user_id: userId,
          role: "institution_admin",
        },
        {
          onConflict: "user_id,role",
          ignoreDuplicates: true,
        }
      );

      if (error) throw error;

      toast.success("Utilizador promovido a entidade/admin institucional.");
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao promover utilizador.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectVolunteer = async (targetUser) => {
    if (!isPlatformAdmin) {
      toast.error("Não tens permissão para esta ação.");
      return;
    }

    try {
      setActionLoadingId(targetUser.id);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          volunteer_status: "rejected",
        })
        .eq("id", targetUser.id);

      if (profileError) throw profileError;

      toast.success("Candidatura de voluntário rejeitada.");
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao rejeitar candidatura.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleViewDocuments = (targetUser) => {
    navigate(`/admin/documents?userId=${targetUser.id}`);
  };

  const getRoleBadge = (roles = []) => {
    if (roles.includes("platform_admin")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-1 text-xs text-purple-700">
          <Shield className="h-3 w-3" />
          Super Admin
        </span>
      );
    }

    if (roles.includes("institution_admin")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs text-orange-700">
          <Building2 className="h-3 w-3" />
          Entidade
        </span>
      );
    }

    if (roles.includes("volunteer")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700">
          <Heart className="h-3 w-3" />
          Voluntário
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-600">
        <User className="h-3 w-3" />
        Utilizador
      </span>
    );
  };

  const getVolunteerBadge = (targetUser) => {
    if (targetUser.roles?.includes("volunteer")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700">
          <Heart className="h-3 w-3" />
          Aprovado
        </span>
      );
    }

    if (targetUser.volunteer_status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
          <Clock3 className="h-3 w-3" />
          Pendente
        </span>
      );
    }

    if (targetUser.volunteer_status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
          <Ban className="h-3 w-3" />
          Rejeitado
        </span>
      );
    }

    if (targetUser.volunteer_status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700">
          <Heart className="h-3 w-3" />
          Aprovado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-600">
        <User className="h-3 w-3" />
        Sem candidatura
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Administração de Utilizadores
          </h1>
          <p className="mt-1 text-slate-500">
            Gestão de contas, estados, candidaturas e permissões.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Voluntariado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const userIsPlatformAdmin =
                  user.roles?.includes("platform_admin");
                const userIsInstitutionAdmin =
                  user.roles?.includes("institution_admin");
                const userIsVolunteer = user.roles?.includes("volunteer");
                const volunteerPending = user.volunteer_status === "pending";

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "Sem nome"}
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>{getRoleBadge(user.roles)}</TableCell>

                    <TableCell>{getVolunteerBadge(user)}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                          user.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Inativo
                          </>
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleToggleStatus(user.id, user.is_active)
                          }
                          disabled={actionLoadingId === user.id}
                        >
                          {user.is_active ? "Desativar" : "Ativar"}
                        </Button>

                        {!userIsPlatformAdmin && !userIsInstitutionAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handlePromoteToInstitutionAdmin(user.id)
                            }
                            disabled={actionLoadingId === user.id}
                          >
                            Tornar Entidade
                          </Button>
                        )}

                        {volunteerPending && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocuments(user)}
                            disabled={actionLoadingId === user.id}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Documentos
                          </Button>
                        )}

                        {!userIsVolunteer && volunteerPending && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectVolunteer(user)}
                            disabled={actionLoadingId === user.id}
                          >
                            Rejeitar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;