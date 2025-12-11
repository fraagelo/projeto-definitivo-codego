import { useState } from "react";
import type { FormEvent } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"assentamento" | "juridico">("assentamento");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      await api.post("/register", {
        email,
        password,
        full_name: fullName,
        role, // novo campo
      });

      setSuccess("Usuário criado com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Erro ao registrar. Verifique os dados ou se o email já existe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-1 text-slate-900">Cadastro</h1>
      <p className="text-sm text-slate-600 mb-4">
        Crie sua conta para acessar o painel da aplicação.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Nome completo
          </label>
          <input
            type="text"
            value={fullName}
            placeholder="Seu nome"
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

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

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Cargo</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "assentamento" | "juridico")
            }
            className="border rounded px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          >
            <option value="assentamento">Assentamento</option>
            <option value="juridico">Jurídico</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Já tem conta?{" "}
        <Link to="/login" className="text-sky-600 hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
