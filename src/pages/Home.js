import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  MapPin,
  ClipboardCheck,
  QrCode,
  ArrowRight,
  Heart,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Navbar from "../components/layout/Navbar";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Coordenação de Voluntários",
      description:
        "Liga voluntários disponíveis a pessoas que necessitam de apoio, permitindo uma resposta mais rápida e organizada.",
    },
    {
      icon: MapPin,
      title: "Mapa de Pedidos de Ajuda",
      description:
        "Visualiza pedidos de ajuda num mapa interativo, facilitando a localização e a distribuição eficiente de recursos.",
    },
    {
      icon: ClipboardCheck,
      title: "Acompanhamento de Missões",
      description:
        "Permite acompanhar o estado de cada pedido de ajuda, desde o registo até à sua conclusão.",
    },
    {
      icon: QrCode,
      title: "Verificação por QR Code",
      description:
        "Confirma a realização da ajuda através de QR Codes, aumentando a segurança e a rastreabilidade das ações.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Registar",
      description:
        "Cria uma conta como voluntário, pessoa vulnerável ou entidade responsável.",
    },
    {
      number: "02",
      title: "Ligar",
      description:
        "Regista um pedido de ajuda ou encontra missões disponíveis na tua zona.",
    },
    {
      number: "03",
      title: "Ajudar",
      description:
        "Aceita missões, presta apoio e acompanha o progresso das ações realizadas.",
    },
  ];

  const stats = [
    { value: "120+", label: "Pedidos Registados" },
    { value: "80+", label: "Voluntários Disponíveis" },
    { value: "95%", label: "Missões Concluídas" },
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="home-page">
      <Navbar />

      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        data-testid="hero-section"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-orange-50"></div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Plataforma de Gestão de Crises
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Protegemos quem mais precisa.{" "}
                <span className="text-orange-500">Juntos.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                O CivicShield é uma plataforma digital de apoio comunitário que
                liga voluntários, pessoas vulneráveis e entidades locais para
                coordenar pedidos de ajuda em situações de emergência.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register?role=volunteer">
                  <Button className="w-full sm:w-auto rounded-full bg-blue-800 hover:bg-blue-900 font-semibold px-8 py-6 text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                    <Heart className="w-5 h-5 mr-2" />
                    Tornar-me voluntário
                  </Button>
                </Link>

                <Link to="/register?role=vulnerable">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-full font-semibold px-8 py-6 text-lg border-2 hover:bg-slate-100 transition-all hover:scale-105"
                  >
                    Preciso de ajuda
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1709701576136-e40ce59c5263?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjB1c2luZyUyMG1vYmlsZSUyMHBob25lJTIwb3V0ZG9vcnMlMjBjaXR5fGVufDB8fHx8MTc3MzU2MjQxNXww&ixlib=rb-4.1.0&q=85"
                  alt="Utilização da plataforma CivicShield"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Missões concluídas
                    </p>
                    <p className="text-xs text-slate-500">
                      acompanhamento em tempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="py-16 md:py-24 bg-white"
        data-testid="how-it-works-section"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-wide uppercase text-blue-800 mb-3">
              Como Funciona
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Simples, rápido e eficaz
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="feature-card text-center h-full">
                <div
                  className="text-6xl font-black text-blue-100 mb-4"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="funcionalidades"
        className="py-16 md:py-24 bg-slate-50"
        data-testid="features-section"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-wide uppercase text-orange-600 mb-3">
              Funcionalidades
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Tecnologia ao serviço da comunidade
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card group">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                    <Icon className="w-7 h-7 text-blue-800 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="impacto"
        className="py-16 md:py-24 bg-blue-800"
        data-testid="impact-section"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase text-blue-200 mb-3">
                Impacto Social
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Comunidades mais preparadas e mais solidárias
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                O CivicShield pretende reforçar a capacidade de resposta local,
                melhorar a coordenação da ajuda e apoiar quem mais precisa em
                momentos críticos.
              </p>

              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p
                      className="text-3xl md:text-4xl font-bold text-orange-400 mb-1"
                      style={{ fontFamily: "Plus Jakarta Sans" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-blue-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1760992003987-efc5259bcfbf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdm9sdW50ZWVycyUyMGhlbHBpbmclMjBjb21tdW5pdHl8ZW58MHx8fHwxNzczNTYyNDE0fDA&ixlib=rb-4.1.0&q=85"
                alt="Voluntários a ajudar a comunidade"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-12" data-testid="footer">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  CivicShield
                </span>
              </div>
              <p className="text-slate-400 max-w-md">
                Plataforma digital de apoio comunitário para coordenação de
                ajuda em situações de crise.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#funcionalidades"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a
                    href="#como-funciona"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#impacto"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Impacto Social
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  civicshield@email.com
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  +351 900 000 000
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm text-center">
              © 2024 CivicShield. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;