import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Sessão iniciada com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Erro ao iniciar sessão.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
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
              className="text-3xl font-bold text-slate-900 mb-2"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Iniciar sessão
            </h1>
            <p className="text-slate-500">
              Entra na plataforma para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teu@email.com"
                  className="pl-10 h-12 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white"
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-blue-800 hover:bg-blue-900 font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  A entrar...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Ainda não tens conta?{" "}
            <Link
              to="/register"
              className="text-blue-800 font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Conta de demonstração interna:
            </p>
            <p className="text-xs text-slate-600">
              Gestão: <span className="font-mono">admin@civicshield.com</span> /{" "}
              <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-blue-900/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1689471335701-904874c90bbf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjByZXNwb25zZSUyMHRlYW0lMjBtZWV0aW5nJTIwZnJpZW5kbHl8ZW58MHx8fHwxNzczNTYyNDE0fDA&ixlib=rb-4.1.0&q=85"
          alt="Equipa de apoio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center">
            <h2
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Cada ação conta
            </h2>
            <p className="text-blue-100 text-lg max-w-md">
              A tecnologia pode aproximar comunidades e acelerar a ajuda a quem
              mais precisa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;