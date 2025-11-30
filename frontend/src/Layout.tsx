import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white shadow">
        <div className="font-semibold text-lg tracking-wide">CODEGO</div>

        <div className="flex items-center gap-4 text-sm">
        {token && (
            <Link to="/dashboard" className="hover:text-sky-300">
            Dashboard
            </Link>
        )}

        {!token && (
            <>
            <Link to="/login" className="hover:text-sky-300">
                Login
            </Link>
            <Link to="/register" className="hover:text-sky-300">
                Cadastro
            </Link>
            </>
        )}

        {token && (
            <button
            onClick={handleLogout}
            className="border border-white/60 px-3 py-1 rounded text-xs uppercase tracking-wide hover:bg-white/10"
            >
            Logout
            </button>
        )}
        </div>

      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
