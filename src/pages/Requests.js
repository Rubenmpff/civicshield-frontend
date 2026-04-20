import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
  Search,
  AlertCircle,
  Heart,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabase";

const Requests = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "medium",
    address: "",
    contact_phone: "",
  });

  const isPlatformAdmin = user?.roles?.includes("platform_admin");
  const isInstitutionAdmin = user?.roles?.includes("institution_admin");
  const isApprovedVolunteer =
    user?.roles?.includes("volunteer") || user?.volunteer_status === "approved";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("help_requests").insert({
        requester_id: user?.id,
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        address: newRequest.address || null,
        contact_phone: newRequest.contact_phone || null,
        latitude: 41.1579 + (Math.random() - 0.5) * 0.04,
        longitude: -8.6291 + (Math.random() - 0.5) * 0.04,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Pedido criado com sucesso.");
      setShowModal(false);
      setNewRequest({
        title: "",
        description: "",
        priority: "medium",
        address: "",
        contact_phone: "",
      });

      await fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!isApprovedVolunteer) {
      toast.error("Só voluntários aprovados podem aceitar missões.");
      return;
    }

    try {
      setActionLoadingId(requestId);

      const { error } = await supabase
        .from("help_requests")
        .update({
          status: "in_progress",
          assigned_volunteer_id: user?.id,
        })
        .eq("id", requestId);

      if (error) throw error;

      const { error: missionError } = await supabase.from("missions").insert({
        help_request_id: requestId,
        volunteer_id: user?.id,
        status: "in_progress",
      });

      if (missionError) {
        console.warn("Erro ao criar missão:", missionError.message);
      }

      const { error: volunteerStatusError } = await supabase
        .from("volunteer_status")
        .upsert({
          user_id: user?.id,
          status: "on_mission",
        });

      if (volunteerStatusError) {
        console.warn(
          "Erro ao atualizar estado do voluntário:",
          volunteerStatusError.message
        );
      }

      toast.success("Missão aceite com sucesso.");
      await fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao aceitar missão.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);

      const { error } = await supabase
        .from("help_requests")
        .update({
          status: "completed",
        })
        .eq("id", requestId);

      if (error) throw error;

      const { error: missionError } = await supabase
        .from("missions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("help_request_id", requestId);

      if (missionError) {
        console.warn("Erro ao concluir missão:", missionError.message);
      }

      const { error: volunteerStatusError } = await supabase
        .from("volunteer_status")
        .upsert({
          user_id: user?.id,
          status: "available",
        });

      if (volunteerStatusError) {
        console.warn(
          "Erro ao atualizar estado do voluntário:",
          volunteerStatusError.message
        );
      }

      toast.success("Missão concluída com sucesso.");
      await fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao concluir missão.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const title = request.title?.toLowerCase() || "";
    const description = request.description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(search) || description.includes(search);

    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    const matchesPriority =
      filterPriority === "all" || request.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityConfig = (priority) => {
    if (priority === "high") {
      return {
        label: "Alta",
        className: "bg-red-50 text-red-700 border border-red-200",
      };
    }

    if (priority === "medium") {
      return {
        label: "Média",
        className: "bg-orange-50 text-orange-700 border border-orange-200",
      };
    }

    return {
      label: "Baixa",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    };
  };

  const getStatusConfig = (status) => {
    if (status === "pending") {
      return {
        label: "Pendente",
        className: "bg-slate-100 text-slate-700 border border-slate-200",
      };
    }

    if (status === "in_progress") {
      return {
        label: "Em curso",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
      };
    }

    return {
      label: "Concluído",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  };

  const renderVolunteerNotice = () => {
    if (isApprovedVolunteer) return null;

    if (user?.volunteer_status === "pending") {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">
                Candidatura de voluntário em análise
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Podes consultar os pedidos, mas só poderás aceitar missões depois
                da aprovação da tua candidatura.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.volunteer_status === "rejected") {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">
                Candidatura de voluntário rejeitada
              </p>
              <p className="mt-1 text-sm text-red-700">
                Podes criar e acompanhar pedidos, mas não podes aceitar missões
                enquanto a candidatura não estiver regularizada.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isPlatformAdmin || isInstitutionAdmin) {
      return (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <ClipboardList className="mt-0.5 h-5 w-5 text-blue-700" />
            <div>
              <p className="font-medium text-blue-800">
                Vista de gestão de pedidos
              </p>
              <p className="mt-1 text-sm text-blue-700">
                Estás a consultar os pedidos com permissões de gestão. A aceitação
                de missões está reservada a voluntários aprovados.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <Heart className="mt-0.5 h-5 w-5 text-slate-600" />
          <div>
            <p className="font-medium text-slate-800">
              Queres ajudar como voluntário?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Podes consultar os pedidos, mas para aceitar missões tens primeiro
              de concluir e aprovar a candidatura de voluntário.
            </p>
          </div>
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Pedidos de Ajuda
            </h1>
            <p className="mt-1 text-slate-500">
              Consulta, cria e acompanha pedidos de apoio.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-blue-800 px-5 font-semibold hover:bg-blue-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Button>
        </div>

        {renderVolunteerNotice()}

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
              type="text"
              placeholder="Pesquisar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os estados</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em curso</option>
            <option value="completed">Concluído</option>
          </select>

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Todas as prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <ClipboardList className="mx-auto mb-4 h-14 w-14 text-slate-300" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Não foram encontrados pedidos
            </h3>
            <p className="text-slate-500">
              Ajusta os filtros ou cria um novo pedido.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredRequests.map((request) => {
              const priority = getPriorityConfig(request.priority);
              const status = getStatusConfig(request.status);

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {request.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priority.className}`}
                      >
                        {priority.label}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-slate-600">
                    {request.description}
                  </p>

                  <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    {request.address && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {request.address}
                      </span>
                    )}

                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(request.created_at).toLocaleDateString("pt-PT")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {request.status === "pending" && isApprovedVolunteer && (
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-blue-800 hover:bg-blue-900"
                        disabled={actionLoadingId === request.id}
                      >
                        {actionLoadingId === request.id
                          ? "A aceitar..."
                          : "Aceitar missão"}
                      </Button>
                    )}

                    {request.status === "in_progress" &&
                      request.assigned_volunteer_id === user?.id && (
                        <Button
                          onClick={() => handleCompleteRequest(request.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={actionLoadingId === request.id}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {actionLoadingId === request.id
                            ? "A concluir..."
                            : "Concluir"}
                        </Button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h2
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Criar novo pedido de ajuda
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Preenche os dados essenciais do pedido.
              </p>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  value={newRequest.title}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, title: e.target.value })
                  }
                  placeholder="Ex: Preciso de transporte"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Descrição
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreve a situação"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Prioridade
                  </label>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                    value={newRequest.priority}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Telefone
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                    value={newRequest.contact_phone}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        contact_phone: e.target.value,
                      })
                    }
                    placeholder="+351 ..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Morada
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  value={newRequest.address}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      address: e.target.value,
                    })
                  }
                  placeholder="Rua, número, localidade"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-900"
                  disabled={submitting}
                >
                  {submitting ? "A criar..." : "Criar pedido"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Requests;