import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export function DistrictSelectPage() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get<string[]>("/districts");
        setDistricts(response.data);
      } catch {
        setError("Erro ao carregar distritos.");
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        Selecionar distrito
      </h1>
      <p className="text-sm text-slate-600">
        Escolha um distrito para ver as empresas.
      </p>

      {loading && <p className="text-sm text-slate-600">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-2">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => navigate(`/lots/select/${encodeURIComponent(d)}`)}
              className="w-full text-left px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              {d}
            </button>
          ))}

          {districts.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhum distrito cadastrado ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
