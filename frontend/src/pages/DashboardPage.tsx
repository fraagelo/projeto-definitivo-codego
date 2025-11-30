import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const { token, setToken } = useAuth();
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(JSON.stringify(response.data, null, 2));
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
            Exemplo de dados protegidos retornados pelo backend.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-600">Carregando informações...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="bg-slate-900 text-slate-50 rounded-lg p-4 text-sm shadow-inner">
          <p className="font-medium mb-2 text-sky-300">Resposta da API:</p>
          <pre className="whitespace-pre-wrap break-words">{data}</pre>
        </div>
      )}
    </div>
  );
}
