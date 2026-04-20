import React, { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  CheckCircle,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  Shield,
  Building2,
  Lock,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

const Volunteers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPlatformAdmin = user?.roles?.includes("platform_admin");
  const isInstitutionAdmin = user?.roles?.includes("institution_admin");
  const isApprovedVolunteer =
    user?.roles?.includes("volunteer") || user?.volunteer_status === "approved";

  const canAccessVolunteersPage =
    isPlatformAdmin || isInstitutionAdmin || isApprovedVolunteer;

  useEffect(() => {
    if (canAccessVolunteersPage) {
      fetchVolunteers();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessVolunteersPage]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const { data: volunteerStatusData, error: volunteerStatusError } =
        await supabase.from("volunteer_status").select("*");

      if (volunteerStatusError) throw volunteerStatusError;

      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select("volunteer_id, status");

      if (missionsError) throw missionsError;

      const volunteerIds = new Set(
        (rolesData || [])
          .filter((roleRow) => roleRow.role === "volunteer")
          .map((roleRow) => roleRow.user_id)
      );

      const statusMap = new Map(
        (volunteerStatusData || []).map((row) => [row.user_id, row.status])
      );

      const missionCountMap = new Map();

      (missionsData || []).forEach((mission) => {
        if (mission.status === "completed") {
          const current = missionCountMap.get(mission.volunteer_id) || 0;
          missionCountMap.set(mission.volunteer_id, current + 1);
        }
      });

      const volunteersList = (profiles || [])
        .filter((profile) => volunteerIds.has(profile.id))
        .map((profile) => ({
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          status: statusMap.get(profile.id) || "offline",
          missions_completed: missionCountMap.get(profile.id) || 0,
          location: null,
          skills: [],
        }));

      setVolunteers(volunteersList);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar os voluntários.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      available: {
        label: "Disponível",
        className: "bg-emerald-50 text-emerald-700",
        icon: CheckCircle,
      },
      on_mission: {
        label: "Em missão",
        className: "bg-blue-50 text-blue-700",
        icon: Clock,
      },
      offline: {
        label: "Offline",
        className: "bg-slate-100 text-slate-500",
        icon: Clock,
      },
    };

    const config = configs[status] || configs.offline;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const renderBlockedState = () => {
    if (user?.volunteer_status === "pending") {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-amber-800">
                Acesso em espera
              </h2>
              <p className="mt-1 text-sm text-amber-700">
                A tua candidatura a voluntário ainda está em análise. Quando os
                teus documentos forem aprovados, terás acesso completo a esta
                área.
              </p>

              <div className="mt-4">
                <Button
                  onClick={() => navigate("/volunteer/documents")}
                  className="bg-blue-800 hover:bg-blue-900"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Ver candidatura
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (user?.volunteer_status === "rejected") {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-800">
                Candidatura rejeitada
              </h2>
              <p className="mt-1 text-sm text-red-700">
                Neste momento não tens acesso à área de voluntários. Revê os
                teus documentos e submete novamente o que for necessário.
              </p>

              <div className="mt-4">
                <Button
                  onClick={() => navigate("/volunteer/documents")}
                  className="bg-blue-800 hover:bg-blue-900"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Rever documentos
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Lock className="h-8 w-8 text-slate-500" />
        </div>

        <h2 className="text-xl font-semibold text-slate-900">
          Área reservada a voluntários aprovados
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Para acederes à rede de voluntários, tens primeiro de completar a tua
          candidatura e submeter os documentos obrigatórios para validação.
        </p>

        <div className="mt-6">
          <Button
            onClick={() => navigate("/volunteer/documents")}
            className="bg-blue-800 hover:bg-blue-900"
          >
            <Upload className="mr-2 h-4 w-4" />
            Iniciar candidatura
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
        </div>
      </DashboardLayout>
    );
  }

  if (!canAccessVolunteersPage) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1
              className="text-3xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Voluntários
            </h1>
            <p className="mt-1 text-slate-500">
              Área disponível apenas para voluntários aprovados e gestão autorizada.
            </p>
          </div>

          {renderBlockedState()}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Voluntários
          </h1>
          <p className="mt-1 text-slate-500">
            Consulta a rede de voluntariado disponível.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Heart className="h-6 w-6 text-blue-800" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {volunteers.length}
                </p>
                <p className="text-sm text-slate-500">Total de Voluntários</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {volunteers.filter((v) => v.status === "available").length}
                </p>
                <p className="text-sm text-slate-500">Disponíveis</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {volunteers.reduce(
                    (acc, v) => acc + (v.missions_completed || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-slate-500">Missões concluídas</p>
              </div>
            </div>
          </div>
        </div>

        {(isPlatformAdmin || isInstitutionAdmin) && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              {isPlatformAdmin ? (
                <Shield className="mt-0.5 h-5 w-5 text-blue-700" />
              ) : (
                <Building2 className="mt-0.5 h-5 w-5 text-blue-700" />
              )}
              <div>
                <p className="font-medium text-blue-800">
                  Vista de gestão autorizada
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  Estás a consultar a rede de voluntários com permissões de gestão.
                </p>
              </div>
            </div>
          </div>
        )}

        {volunteers.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-12 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Ainda não existem voluntários
            </h3>
            <p className="text-slate-500">
              Regista voluntários para começares a coordenar missões.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="rounded-xl border border-slate-100 bg-white p-6 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-lg font-bold text-blue-800">
                        {volunteer.name?.charAt(0).toUpperCase() || "V"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {volunteer.name || "Sem nome"}
                      </h3>
                      <p className="text-sm text-slate-500">{volunteer.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(volunteer.status)}
                </div>

                <div className="space-y-3">
                  {volunteer.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      <span>Zona ativa registada</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Star className="h-4 w-4 text-orange-400" />
                    <span>
                      {volunteer.missions_completed || 0} missões concluídas
                    </span>
                  </div>

                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {volunteer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Volunteers;