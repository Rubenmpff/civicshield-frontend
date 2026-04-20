import React, { useEffect, useState } from "react";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  ShieldCheck,
  XCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

const BUCKET_NAME = "volunteer-documents";

const VolunteerDocuments = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submittingType, setSubmittingType] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const refreshData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, wants_volunteer, volunteer_status")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: docsData, error: docsError } = await supabase
        .from("volunteer_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (docsError) throw docsError;

      setProfileInfo(profileData);
      setDocuments(docsData || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar documentos.");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentByType = (documentType) => {
    return documents.find((doc) => doc.document_type === documentType) || null;
  };

  const validateFile = (file) => {
    if (!file) {
      return "Nenhum ficheiro selecionado.";
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return "Formato inválido. Usa JPG, PNG ou PDF.";
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return "O ficheiro excede o limite de 5 MB.";
    }

    return null;
  };

  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSubmittingType(documentType);

      const extension = file.name.split(".").pop()?.toLowerCase() || "dat";
      const safeTypeFolder =
        documentType === "citizen_card" ? "citizen_card" : "criminal_record";
      const filePath = `${user.id}/${safeTypeFolder}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const payload = {
        user_id: user.id,
        document_type: documentType,
        file_path: filePath,
        original_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        status: "pending",
        rejection_reason: null,
        reviewed_at: null,
      };

      const { error: dbError } = await supabase
        .from("volunteer_documents")
        .upsert(payload, {
          onConflict: "user_id,document_type",
          ignoreDuplicates: false,
        });

      if (dbError) throw dbError;

      toast.success("Documento enviado com sucesso.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erro ao enviar documento.");
    } finally {
      setSubmittingType(null);
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle className="h-3 w-3" />
          Aprovado
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />
          Rejeitado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
        <Clock3 className="h-3 w-3" />
        Pendente
      </span>
    );
  };

  const renderApplicationStatusBadge = () => {
    if (profileInfo?.volunteer_status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
          <Clock3 className="h-4 w-4" />
          Candidatura pendente
        </span>
      );
    }

    if (profileInfo?.volunteer_status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Candidatura aprovada
        </span>
      );
    }

    if (profileInfo?.volunteer_status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          Candidatura rejeitada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
        <FileText className="h-4 w-4" />
        Sem candidatura ativa
      </span>
    );
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("pt-PT");
  };

  const citizenCard = getDocumentByType("citizen_card");
  const criminalRecord = getDocumentByType("criminal_record");

  const documentsCount = [citizenCard, criminalRecord].filter(Boolean).length;

  const renderDocumentCard = ({
    title,
    subtitle,
    accentClass,
    documentData,
    submittingKey,
    inputKey,
    documentType,
    buttonLabel,
  }) => {
    const isUploading = submittingType === submittingKey;
    const alreadyUploaded = !!documentData;
    const isRejected = documentData?.status === "rejected";

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className={`rounded-xl p-3 ${accentClass}`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {documentData ? (
            <>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ficheiro enviado
                </p>
                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  {documentData.original_name || "Documento enviado"}
                </p>

                <div className="mt-3">{renderStatusBadge(documentData.status)}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Enviado em
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(documentData.created_at)}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Revisto em
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(documentData.reviewed_at)}</span>
                  </div>
                </div>
              </div>

              {documentData.rejection_reason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-red-400">
                    Motivo da rejeição
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    {documentData.rejection_reason}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Ainda não enviaste este documento.
            </div>
          )}

          <label className="block">
            <Button
              type="button"
              className="bg-blue-800 hover:bg-blue-900"
              disabled={isUploading}
              onClick={() =>
                document.querySelector(`input[data-doc="${inputKey}"]`)?.click()
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A enviar...
                </>
              ) : alreadyUploaded ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isRejected ? "Substituir documento" : "Atualizar documento"}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {buttonLabel}
                </>
              )}
            </Button>

            <input
              data-doc={inputKey}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => handleFileUpload(e, documentType)}
            />
          </label>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Documentos de Voluntário
          </h1>
          <p className="mt-1 text-slate-500">
            Envia os documentos necessários para concluir a tua candidatura.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Estado da candidatura
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Candidato: {profileInfo?.full_name || user?.name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Documentos enviados: {documentsCount}/2
              </p>
            </div>

            <div>{renderApplicationStatusBadge()}</div>
          </div>
        </div>

        {profileInfo?.volunteer_status === "rejected" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  A tua candidatura precisa de correções
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Revê os documentos rejeitados e volta a enviá-los para nova validação.
                </p>
              </div>
            </div>
          </div>
        )}

        {profileInfo?.volunteer_status === "approved" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">
                  A tua candidatura foi aprovada
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  Já foste validado como voluntário. Podes agora participar nas missões da plataforma.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {renderDocumentCard({
            title: "Cartão de Cidadão",
            subtitle: "JPG, PNG ou PDF até 5 MB",
            accentClass: "bg-blue-50 text-blue-800",
            documentData: citizenCard,
            submittingKey: "citizen_card",
            inputKey: "citizen_card",
            documentType: "citizen_card",
            buttonLabel: "Enviar Cartão de Cidadão",
          })}

          {renderDocumentCard({
            title: "Registo Criminal",
            subtitle: "JPG, PNG ou PDF até 5 MB",
            accentClass: "bg-orange-50 text-orange-600",
            documentData: criminalRecord,
            submittingKey: "criminal_record",
            inputKey: "criminal_record",
            documentType: "criminal_record",
            buttonLabel: "Enviar Registo Criminal",
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VolunteerDocuments;