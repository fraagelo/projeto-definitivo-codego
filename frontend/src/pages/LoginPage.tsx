import { useState } from "react";
import type { FormEvent } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      const response = await api.post("/login", { email, password });
      const accessToken: string = response.data.access_token;

      setToken(accessToken);
      navigate("/dashboard");
    } catch {
      setError("Falha no login (verifique email e senha).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-1 text-slate-900">Login</h1>
      <p className="text-sm text-slate-600 mb-4">
        Acesse sua conta para visualizar o dashboard.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            placeholder="seuemail@empresa.com"
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Senha</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Não tem conta?{" "}
        <Link to="/register" className="text-sky-600 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
