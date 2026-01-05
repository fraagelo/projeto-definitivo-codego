import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";
import logoCodego from "./assets/logo-codego.png";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { token, setToken, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    setToken(null);
  };

  // Sem usuário: mantém layout simples com navbar e conteúdo centralizado
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100">
        <nav className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white shadow">
          <div className="flex items-center gap-4 text-sm">
            <Link to="/login" className="hover:text-sky-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-sky-300">
              Cadastro
            </Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </div>
    );
  }

  const isActive = (to: string) => location.pathname.startsWith(to);

  const assentamentoLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/lots/new", label: "Cadastrar nova empresa" },
    { to: "/lots/select", label: "Editar cadastro" },        // mesma tela, mas clicando em empresa existente
    { to: "/reports", label: "Gerar relatório" },          // ou outra rota de relatório
  ]

  const juridicoLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/lots/new", label: "Cadastrar nova empresa"  },
    { to: "/lots/select", label: "Editar dados jurídicos" },
    { to: "/reports", label: "Gerar relatório"  },
  ];

  const links = user.role === "juridico" ? juridicoLinks : assentamentoLinks;

  // Com usuário logado: navbar + sidebar + conteúdo
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Navbar superior */}
      <nav className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white shadow">
        <div className="flex items-center gap-4 text-sm">
          {token && (
            <div className="flex items-center gap-2 text-sky-200">
              <span className="text-xs">Olá,</span>
              <span className="font-medium max-w-[150px] truncate">
                {user.full_name}
              </span>
              <span className="text-xs opacity-75">({user.email})</span>
            </div>
          )}
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="border border-white/60 px-3 py-1 rounded text-xs uppercase tracking-wide hover:bg-white/10"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Conteúdo com sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
            <img src={logoCodego} alt="CODEGO"  className="h-8 w-auto"/>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">
                {user.role === "assentamento"
                  ? "Módulo Assentamento"
                  : user.role === "juridico"
                  ? "Módulo Jurídico"
                  : "Usuário"}
              </span>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
            {links.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className={[
                  "block rounded px-3 py-2 transition-colors",
                  isActive(link.to)
                    ? "bg-slate-800 text-sky-300"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Área principal */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
