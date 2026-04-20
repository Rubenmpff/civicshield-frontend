import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              CivicShield
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("funcionalidades")}
              className="text-slate-600 hover:text-blue-800 font-medium transition-colors"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-slate-600 hover:text-blue-800 font-medium transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("impacto")}
              className="text-slate-600 hover:text-blue-800 font-medium transition-colors"
            >
              Impacto Social
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-full bg-blue-800 hover:bg-blue-900 font-semibold px-6">
                Começar Agora
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("funcionalidades")}
                className="text-left px-4 py-2 text-slate-600 hover:text-blue-800 font-medium"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-left px-4 py-2 text-slate-600 hover:text-blue-800 font-medium"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection("impacto")}
                className="text-left px-4 py-2 text-slate-600 hover:text-blue-800 font-medium"
              >
                Impacto Social
              </button>

              <div className="flex flex-col gap-2 px-4 pt-3 border-t border-slate-100">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-blue-800 hover:bg-blue-900">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;