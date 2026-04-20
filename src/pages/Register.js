import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowLeft,
  Heart,
  Users,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const volunteerPreset = searchParams.get("role") === "volunteer";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isVolunteer: volunteerPreset,
    isOrganization: false,
    organizationName: "",
    organizationType: "",
    adminRequest: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildRoles = () => {
    return ["requester"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        buildRoles(),
        {
          admin_request: formData.adminRequest,
          account_type: formData.isOrganization ? "organization" : "individual",
          organization_name: formData.isOrganization
            ? formData.organizationName
            : null,
          organization_type: formData.isOrganization
            ? formData.organizationType
            : null,
          verification_status:
            formData.isOrganization && formData.adminRequest
              ? "pending"
              : null,
          wants_volunteer: formData.isVolunteer,
          volunteer_status: formData.isVolunteer ? "pending" : "none",
        }
      );

      toast.success("Conta criada com sucesso.");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Erro ao criar conta.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="register-page">
      <div className="flex-1 flex flex-col justify-center bg-white px-8 py-8 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-800">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              CivicShield
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="mb-2 text-3xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Criar conta
            </h1>
            <p className="text-slate-500">
              Junta-te à plataforma e participa na rede de apoio comunitário.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="O teu nome"
                  className="h-12 rounded-lg border-slate-200 bg-slate-50/50 pl-10 focus:bg-white"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teu@email.com"
                  className="h-12 rounded-lg border-slate-200 bg-slate-50/50 pl-10 focus:bg-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Palavra-passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-lg border-slate-200 bg-slate-50/50 pl-10 focus:bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700">Como queres participar?</Label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-orange-100 p-2">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Posso pedir ajuda quando necessário
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Esta opção fica ativa por defeito para todos os utilizadores.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
                <input
                  type="checkbox"
                  name="isVolunteer"
                  checked={formData.isVolunteer}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-800" />
                    <p className="font-medium text-slate-900">
                      Quero candidatar-me a voluntário
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    A candidatura ficará pendente de validação antes de poderes
                    aceitar missões.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
                <input
                  type="checkbox"
                  name="isOrganization"
                  checked={formData.isOrganization}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-slate-700" />
                    <p className="font-medium text-slate-900">
                      Estou a registar uma entidade / organização
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Exemplo: bombeiros, proteção civil, IPSS, junta de freguesia.
                  </p>
                </div>
              </label>

              {formData.isOrganization && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-slate-700">
                      Nome da organização
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      placeholder="Ex: Bombeiros Voluntários de Braga"
                      className="h-12 rounded-lg border-slate-200 bg-white"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required={formData.isOrganization}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType" className="text-slate-700">
                      Tipo de entidade
                    </Label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-300"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required={formData.isOrganization}
                    >
                      <option value="">Seleciona uma opção</option>
                      <option value="fire_department">Bombeiros</option>
                      <option value="civil_protection">Proteção Civil</option>
                      <option value="municipality">Câmara / Município</option>
                      <option value="parish_council">Junta de Freguesia</option>
                      <option value="ipss">IPSS</option>
                      <option value="ngo">Associação / ONG</option>
                      <option value="healthcare">Unidade de Saúde</option>
                      <option value="other">Outra</option>
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
                    <input
                      type="checkbox"
                      name="adminRequest"
                      checked={formData.adminRequest}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                        <p className="font-medium text-slate-900">
                          Pretendo candidatura para funções institucionais
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Este pedido não atribui permissões automaticamente.
                        Fica pendente de validação pelos responsáveis da plataforma.
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-blue-800 text-lg font-semibold transition-all hover:scale-[1.02] hover:bg-blue-900 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  A criar conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Já tens conta?{" "}
            <Link to="/login" className="font-semibold text-blue-800 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 z-10 bg-orange-600/80"></div>
        <img
          src="https://images.unsplash.com/photo-1758599669406-d5179ccefcb9?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Rede de voluntariado"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Faz parte da mudança
            </h2>
            <p className="max-w-md text-lg text-orange-100">
              Regista-te e ajuda a construir comunidades mais resilientes,
              seguras e solidárias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;