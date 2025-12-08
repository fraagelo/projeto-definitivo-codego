import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function DashboardPage() {
  const { token, setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;

      try {
        setLoading(true);
        await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        setError("Erro ao carregar dashboard, faça login novamente.");
        setToken(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, setToken, navigate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Selecione a empresa para editar os dados.
          </p>
        </div>
      </div>

      <div className="mt-2 bg-white rounded-lg shadow p-4">
        <p className="text-sm font-medium text-slate-800 mb-2">
          Editar dados por empresa
        </p>

        <div className="flex flex-col gap-2">
          <Link
            to="/lots/2/edit"
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            GRECA DISTRIBUIDORA DE ASFALTOS LTDA.
          </Link>
          <Link
            to="/lots/3/edit"
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            PLANALTO BLOCOS E ARTEFATOS DE CIMENTO LTDA
          </Link>
          <Link
            to="/lots/4/edit"
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            JM PALETES EMPREENDIMENTOS DE MADEIRA LTDA
          </Link>
          <Link
            to="/lots/5/edit"
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            NJF INDÚSTRIA E COMÉRCIO LTDA
          </Link>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-600">Carregando informações...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
