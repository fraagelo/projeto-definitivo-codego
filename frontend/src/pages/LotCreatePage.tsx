import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export function LotCreatePage() {
  const { distrito } = useParams<{ distrito: string }>();
  const navigate = useNavigate();
  const [municipio, setMunicipio] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/lots", {
        municipio,
        empresa,
        cnpj: cnpj || null,
        distrito: distrito || null, // vem do distrito atual
      });
      navigate(`/lots/${response.data.id}/edit`);
    } catch {
      setError("Erro ao criar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-2 text-slate-900">
        Nova empresa {distrito && `- ${distrito}`}
      </h1>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Município
          </label>
          <input
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Empresa
          </label>
          <input
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            CNPJ (opcional)
          </label>
          <input
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar empresa"}
        </button>
      </form>
    </div>
  );
}
