import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

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
            Acesse as empresas para editar os dados.
          </p>
        </div>

        <button
          onClick={() => navigate("/lots/select")}
          className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Editar dados das empresas
        </button>
      </div>

      {loading && (
        <p className="text-sm text-slate-600">Carregando informações...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
