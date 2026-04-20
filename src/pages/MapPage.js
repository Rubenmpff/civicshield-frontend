import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import LeafletMap from "../components/map/LeafletMap";
import { helpRequestsApi, volunteersApi } from "../services/api";
import { toast } from "sonner";

const MapPage = () => {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, volunteersRes] = await Promise.all([
        helpRequestsApi.getAll(),
        volunteersApi.getAll(),
      ]);

      setRequests(requestsRes.data);
      setVolunteers(volunteersRes.data);
    } catch (error) {
      toast.error("Erro ao carregar o mapa.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
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
            Mapa de Crises
          </h1>
          <p className="text-slate-500 mt-1">
            Visualização em tempo real de pedidos e voluntários.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-slate-900">
              {requests.filter((r) => r.status === "pending").length}
            </p>
            <p className="text-sm text-slate-500">Pendentes</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-slate-900">
              {requests.filter((r) => r.status === "in_progress").length}
            </p>
            <p className="text-sm text-slate-500">Em curso</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-blue-800">
              {volunteers.filter((v) => v.status === "available").length}
            </p>
            <p className="text-sm text-slate-500">Voluntários disponíveis</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-emerald-600">
              {requests.filter((r) => r.status === "completed").length}
            </p>
            <p className="text-sm text-slate-500">Concluídos</p>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
          style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}
        >
          <LeafletMap
            helpRequests={requests.filter((r) => r.status !== "completed")}
            volunteers={volunteers}
            showLegend={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;