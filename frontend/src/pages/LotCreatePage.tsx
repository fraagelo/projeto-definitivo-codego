import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export function LotCreatePage() {
  const navigate = useNavigate();

  const [municipio, setMunicipio] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [distrito, setDistrito] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get<string[]>("/districts");
        setDistricts(res.data);
      } catch {
        setError("Erro ao carregar distritos.");
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!distrito) {
      setFormError("Selecione um distrito.");
      return;
    }
    if (!empresa.trim()) {
      setFormError("Informe o nome da empresa.");
      return;
    }
    if (!municipio.trim()) {
      setFormError("Informe o município.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFormError(null);
      
      const response = await api.post("/lots", {
        municipio,
        empresa,
        cnpj: cnpj || null,
        distrito,
      });
      navigate(`/lots/${response.data.id}/edit`, {
        state: { created: true, empresa },
      });
    } catch {
      setError("Erro ao criar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-2 text-slate-900">
        Cadastrar nova empresa
      </h1>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {formError && <p className="text-sm text-red-600 mb-2">{formError}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Distrito
          </label>
          <select
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
            disabled={loadingDistricts}
          >
            <option value="">
              {loadingDistricts ? "Carregando distritos..." : "Selecione um distrito"}
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

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
            required
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
          disabled={loading || loadingDistricts}
          className="mt-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar empresa"}
        </button>
      </form>
    </div>
  );
}
