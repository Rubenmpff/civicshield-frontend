import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ClipboardList,
  Heart,
  CheckCircle,
  Clock,
  Shield,
  Building2,
  User,
  AlertCircle,
  Upload,
  FileText,
  XCircle,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    volunteersCount: 0,
    availableVolunteers: 0,
    myRequests: 0,
    myMissions: 0,
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        helpRequestsRes,
        rolesRes,
        volunteerStatusRes,
        missionsRes,
        documentsRes,
      ] = await Promise.all([
        supabase.from("help_requests").select("*"),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("volunteer_status").select("*"),
        supabase.from("missions").select("*"),
        supabase
          .from("volunteer_documents")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false }),
      ]);

      if (helpRequestsRes.error) throw helpRequestsRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (volunteerStatusRes.error) throw volunteerStatusRes.error;
      if (missionsRes.error) throw missionsRes.error;
      if (documentsRes.error) throw documentsRes.error;

      const helpRequests = helpRequestsRes.data || [];
      const rolesData = rolesRes.data || [];
      const volunteerStatus = volunteerStatusRes.data || [];
      const missions = missionsRes.data || [];

      const volunteerIds = new Set(
        rolesData.filter((r) => r.role === "volunteer").map((r) => r.user_id)
      );

      const availableVolunteers = volunteerStatus.filter(
        (v) => v.status === "available"
      ).length;

      const myRequests = helpRequests.filter(
        (r) => r.requester_id === user?.id
      ).length;

      const myMissions = missions.filter((m) => m.volunteer_id === user?.id).length;

      setStats({
        totalRequests: helpRequests.length,
        pendingRequests: helpRequests.filter((r) => r.status === "pending").length,
        inProgressRequests: helpRequests.filter((r) => r.status === "in_progress").length,
        completedRequests: helpRequests.filter((r) => r.status === "completed").length,
        volunteersCount: volunteerIds.size,
        availableVolunteers,
        myRequests,
        myMissions,
      });

      setDocuments(documentsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const isPlatformAdmin = user?.roles?.includes("platform_admin");
  const isInstitutionAdmin = user?.roles?.includes("institution_admin");
  const isVolunteer = user?.roles?.includes("volunteer");

  const getRoleBadge = () => {
    if (isPlatformAdmin) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
          <Shield className="h-4 w-4" />
          Super Admin
        </span>
      );
    }

    if (isInstitutionAdmin) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
          <Building2 className="h-4 w-4" />
          Entidade
        </span>
      );
    }

    if (isVolunteer) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          <Heart className="h-4 w-4" />
          Voluntário
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
        <User className="h-4 w-4" />
        Utilizador
      </span>
    );
  };

  const getDocumentByType = (type) => {
    return documents.find((doc) => doc.document_type === type);
  };

  const citizenCardDoc = getDocumentByType("citizen_card");
  const criminalRecordDoc = getDocumentByType("criminal_record");

  const hasSubmittedAnyDocument = documents.length > 0;
  const hasSubmittedBothDocuments = citizenCardDoc && criminalRecordDoc;

  const renderVolunteerApplicationCard = () => {
    if (isVolunteer || user?.volunteer_status === "approved") {
      return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">
                  Candidatura aprovada
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  Já foste aprovado como voluntário e podes participar nas missões da plataforma.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/volunteers")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              <Heart className="h-4 w-4" />
              Ver área de voluntários
            </button>
          </div>
        </div>
      );
    }

    if (user?.volunteer_status === "rejected") {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  Candidatura rejeitada
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Alguns documentos precisam de correção. Revê o estado da candidatura e volta a submeter o que for necessário.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/volunteer/documents")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              <Upload className="h-4 w-4" />
              Rever documentos
            </button>
          </div>
        </div>
      );
    }

    if (user?.wants_volunteer && user?.volunteer_status === "pending") {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  Candidatura a voluntário pendente
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {hasSubmittedBothDocuments
                    ? "Os teus documentos já foram enviados. A candidatura está em análise."
                    : hasSubmittedAnyDocument
                    ? "Já submeteste alguns documentos, mas ainda faltam ficheiros para concluir a candidatura."
                    : "Envia os teus documentos para concluir o processo de validação."}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/volunteer/documents")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              <Upload className="h-4 w-4" />
              {hasSubmittedBothDocuments ? "Ver candidatura" : "Enviar documentos"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-5 w-5 text-blue-700" />
            <div>
              <p className="font-medium text-blue-800">
                Queres tornar-te voluntário?
              </p>
              <p className="mt-1 text-sm text-blue-700">
                Junta-te à rede de apoio da plataforma. Para isso, tens de submeter os documentos necessários para validação.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/volunteer/documents")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            <ArrowRight className="h-4 w-4" />
            Iniciar candidatura
          </button>
        </div>
      </div>
    );
  };

  const getVolunteerStatusLabel = () => {
    if (user?.volunteer_status === "pending") return "Pendente";
    if (user?.volunteer_status === "approved") return "Aprovado";
    if (user?.volunteer_status === "rejected") return "Rejeitado";
    if (user?.roles?.includes("volunteer")) return "Voluntário ativo";
    return "Sem candidatura";
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Olá, {user?.name?.split(" ")[0] || "Utilizador"}
            </h1>
            <p className="mt-1 text-slate-500">
              Bem-vindo ao painel principal do CivicShield.
            </p>
          </div>

          <div>{getRoleBadge()}</div>
        </div>

        {renderVolunteerApplicationCard()}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <ClipboardList className="h-6 w-6 text-blue-800" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalRequests}
            </p>
            <p className="mt-1 text-sm text-slate-500">Pedidos totais</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Clock className="h-6 w-6 text-slate-700" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.pendingRequests}
            </p>
            <p className="mt-1 text-sm text-slate-500">Pedidos pendentes</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Heart className="h-6 w-6 text-blue-800" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.availableVolunteers}
            </p>
            <p className="mt-1 text-sm text-slate-500">Voluntários disponíveis</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.completedRequests}
            </p>
            <p className="mt-1 text-sm text-slate-500">Pedidos concluídos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Resumo operacional
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Estado atual da atividade na plataforma.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats.pendingRequests}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Em curso</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats.inProgressRequests}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Concluídos</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats.completedRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              A minha atividade
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Resumo personalizado da tua conta.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Os meus pedidos</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats.myRequests}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">As minhas missões</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats.myMissions}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Estado voluntário</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {getVolunteerStatusLabel()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Documentos enviados</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {documents.length}/2
                </p>
              </div>

              <button
                onClick={() => navigate("/volunteer/documents")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                <FileText className="h-4 w-4" />
                Gerir candidatura
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Estado geral da plataforma
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Indicadores rápidos para acompanhamento diário.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Total de voluntários</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.volunteersCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Disponíveis agora</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.availableVolunteers}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Pedidos ativos</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.pendingRequests + stats.inProgressRequests}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Taxa de conclusão</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.totalRequests > 0
                  ? `${Math.round(
                      (stats.completedRequests / stats.totalRequests) * 100
                    )}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;