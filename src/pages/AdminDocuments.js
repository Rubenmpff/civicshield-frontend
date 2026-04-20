import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
  Clock3,
  Ban,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BUCKET_NAME = "volunteer-documents";

const AdminDocuments = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [summaryRows, setSummaryRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isPlatformAdmin = user?.roles?.includes("platform_admin");
  const selectedUserId = searchParams.get("userId");

  useEffect(() => {
    if (isPlatformAdmin) {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlatformAdmin, authLoading, selectedUserId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (selectedUserId) {
        await fetchSingleUserDocuments(selectedUserId);
      } else {
        await fetchSummary();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar documentos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleUserDocuments = async (userId) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, volunteer_status, wants_volunteer")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) throw profileError;

    const { data: docsData, error: docsError } = await supabase
      .from("volunteer_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (docsError) throw docsError;

    setCandidateProfile(profileData || null);
    setDocuments(docsData || []);
    setSummaryRows([]);
  };

  const fetchSummary = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, volunteer_status, wants_volunteer")
      .eq("wants_volunteer", true)
      .order("created_at", { ascending: false });

    if (profilesError) throw profilesError;

    const { data: docsData, error: docsError } = await supabase
      .from("volunteer_documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (docsError) throw docsError;

    const rows = (profilesData || []).map((profile) => {
      const userDocs = (docsData || []).filter((doc) => doc.user_id === profile.id);

      const citizenCard = userDocs.find(
        (doc) => doc.document_type === "citizen_card"
      );

      const criminalRecord = userDocs.find(
        (doc) => doc.document_type === "criminal_record"
      );

      return {
        ...profile,
        documentsCount: userDocs.length,
        citizenCardStatus: citizenCard?.status || "missing",
        criminalRecordStatus: criminalRecord?.status || "missing",
        lastSubmissionAt: userDocs.length
          ? userDocs
              .map((doc) => doc.created_at)
              .sort((a, b) => new Date(b) - new Date(a))[0]
          : null,
      };
    });

    setSummaryRows(rows);
    setCandidateProfile(null);
    setDocuments([]);
  };

  const checkAndApproveVolunteer = async (userId) => {
    const { data, error } = await supabase
      .from("volunteer_documents")
      .select("document_type, status")
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      toast.error("Erro ao verificar documentos do utilizador.");
      return;
    }

    const citizenCardApproved = data?.some(
      (doc) =>
        doc.document_type === "citizen_card" && doc.status === "approved"
    );

    const criminalRecordApproved = data?.some(
      (doc) =>
        doc.document_type === "criminal_record" && doc.status === "approved"
    );

    if (citizenCardApproved && criminalRecordApproved) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          volunteer_status: "approved",
          wants_volunteer: true,
        })
        .eq("id", userId);

      if (profileError) {
        console.error(profileError);
        toast.error("Erro ao atualizar estado do voluntário.");
        return;
      }

      const { error: roleError } = await supabase.from("user_roles").upsert(
        {
          user_id: userId,
          role: "volunteer",
        },
        {
          onConflict: "user_id,role",
          ignoreDuplicates: true,
        }
      );

      if (roleError) {
        console.error(roleError);
        toast.error("Erro ao atribuir role de voluntário.");
        return;
      }

      toast.success("Utilizador aprovado como voluntário.");
    }
  };

  const handleApprove = async (doc) => {
    if (!isPlatformAdmin) {
      toast.error("Não tens permissão para esta ação.");
      return;
    }

    try {
      setActionLoadingId(doc.id);

      const { error } = await supabase
        .from("volunteer_documents")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq("id", doc.id);

      if (error) throw error;

      await checkAndApproveVolunteer(doc.user_id);

      toast.success("Documento aprovado.");
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao aprovar documento.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (doc) => {
    if (!isPlatformAdmin) {
      toast.error("Não tens permissão para esta ação.");
      return;
    }

    const reason = window.prompt("Motivo da rejeição:");

    if (!reason) return;

    try {
      setActionLoadingId(doc.id);

      const { error } = await supabase
        .from("volunteer_documents")
        .update({
          status: "rejected",
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", doc.id);

      if (error) throw error;

      toast.success("Documento rejeitado.");
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao rejeitar documento.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(doc.file_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Não foi possível gerar link do documento.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao abrir documento.");
    }
  };

  const getDocumentStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle className="h-3 w-3" />
          Aprovado
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />
          Rejeitado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <Loader2 className="h-3 w-3" />
        Pendente
      </span>
    );
  };

  const getVolunteerStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          <ShieldCheck className="h-3 w-3" />
          Voluntário aprovado
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
          <Ban className="h-3 w-3" />
          Candidatura rejeitada
        </span>
      );
    }

    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
          <Clock3 className="h-3 w-3" />
          Candidatura pendente
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        <User className="h-3 w-3" />
        Sem candidatura
      </span>
    );
  };

  const getSummaryDocBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
          <CheckCircle className="h-3 w-3" />
          Aprovado
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
          <XCircle className="h-3 w-3" />
          Rejeitado
        </span>
      );
    }

    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
          <Clock3 className="h-3 w-3" />
          Pendente
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
        <FileText className="h-3 w-3" />
        Em falta
      </span>
    );
  };

  const getDocumentLabel = (type) => {
    if (type === "citizen_card") return "Cartão de Cidadão";
    if (type === "criminal_record") return "Registo Criminal";
    return type;
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("pt-PT");
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Validação de Documentos
            </h1>
            <p className="mt-1 text-slate-500">
              {selectedUserId
                ? "A analisar documentos do utilizador selecionado."
                : "Rever candidaturas e abrir o detalhe de cada utilizador."}
            </p>
          </div>

          {selectedUserId && (
            <Button
              variant="outline"
              onClick={() => navigate("/admin/documents")}
            >
              Voltar à lista
            </Button>
          )}
        </div>

        {!selectedUserId ? (
          summaryRows.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <h2 className="text-lg font-semibold text-slate-900">
                Ainda não existem candidaturas com documentos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Quando os candidatos enviarem documentos, aparecem aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {summaryRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {row.full_name || "Sem nome"}
                        </h2>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span>{row.email || "Sem email"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getVolunteerStatusBadge(row.volunteer_status)}
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          <FileText className="h-3 w-3" />
                          {row.documentsCount} documento(s)
                        </span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Cartão de Cidadão
                          </p>
                          <div className="mt-2">
                            {getSummaryDocBadge(row.citizenCardStatus)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Registo Criminal
                          </p>
                          <div className="mt-2">
                            {getSummaryDocBadge(row.criminalRecordStatus)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Último envio
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span>{formatDate(row.lastSubmissionAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:w-[220px] lg:flex-col">
                      <Button
                        onClick={() =>
                          navigate(`/admin/documents?userId=${row.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver candidatura
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {candidateProfile && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Dados do candidato
                    </h2>

                    <div className="flex flex-col gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{candidateProfile.full_name || "Sem nome"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{candidateProfile.email || "Sem email"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {getVolunteerStatusBadge(candidateProfile.volunteer_status)}
                  </div>
                </div>
              </div>
            )}

            {documents.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Ainda não existem documentos enviados
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quando os utilizadores enviarem documentos, aparecem aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {getDocumentLabel(doc.document_type)}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Documento submetido pelo candidato.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Ficheiro
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-900 break-all">
                              {doc.original_name || "Sem nome"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Estado
                            </p>
                            <div className="mt-2">
                              {getDocumentStatusBadge(doc.status)}
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Enviado em
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              <span>{formatDate(doc.created_at)}</span>
                            </div>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Revisto em
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              <span>{formatDate(doc.reviewed_at)}</span>
                            </div>
                          </div>
                        </div>

                        {doc.rejection_reason && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-red-400">
                              Motivo da rejeição
                            </p>
                            <p className="mt-1 text-sm text-red-700">
                              {doc.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 lg:w-[260px] lg:flex-col">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenDocument(doc)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver documento
                        </Button>

                        {doc.status !== "approved" && (
                          <Button
                            onClick={() => handleApprove(doc)}
                            disabled={actionLoadingId === doc.id}
                          >
                            Aprovar
                          </Button>
                        )}

                        {doc.status !== "rejected" && (
                          <Button
                            variant="outline"
                            onClick={() => handleReject(doc)}
                            disabled={actionLoadingId === doc.id}
                          >
                            Rejeitar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDocuments;