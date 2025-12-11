import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

type LotSummary = {
  id: number;
  empresa: string | null;
};

export function LotSelectPage() {
  const { distrito } = useParams<{ distrito: string }>();
  const navigate = useNavigate();
  const [lots, setLots] = useState<LotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLots = async () => {
      if (!distrito) return;
      try {
        setLoading(true);
        const params = search ? `?q=${encodeURIComponent(search)}` : "";
        const response = await api.get(
          `/lots/by-district/${encodeURIComponent(distrito)}${params}`
        );
        setLots(response.data);
        setError(null);
      } catch {
        setError("Erro ao carregar empresas do distrito.");
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, [distrito, search]);

  if (!distrito) {
    return <p>Distrito não informado.</p>;
  }

  const handleCreateLot = () => {
    navigate(`/lots/new/${encodeURIComponent(distrito)}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Empresas do distrito: {distrito}
          </h1>
          <p className="text-sm text-slate-600">
            Selecione uma empresa para editar os dados.
          </p>
        </div>

        <button
          onClick={handleCreateLot}
          className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Nova empresa neste distrito
        </button>
      </div>

      {/* Campo de busca */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Buscar por nome da empresa
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Digite parte do nome..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      {loading && <p className="text-sm text-slate-600">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-2">
          {lots.map((lot) => (
            <button
              key={lot.id}
              onClick={() => navigate(`/lots/${lot.id}/edit`)}
              className="w-full text-left px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              {lot.empresa ?? `Empresa ${lot.id}`}
            </button>
          ))}

          {lots.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhuma empresa encontrada com esse filtro.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
