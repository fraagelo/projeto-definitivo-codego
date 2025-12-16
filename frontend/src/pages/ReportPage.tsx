import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

type Lot = {
  id: number;
  empresa: string;
  municipio: string;
  distrito: string;
  cnpj?: string;
  [key: string]: any;
};

export function ReportPage() {
  const { user } = useAuth();
  const [lots, setLots] = useState<Lot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await api.get("/lots");
        setLots(res.data);
      } catch {
        setError("Erro ao carregar empresas.");
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);

  const handleGeneratePdf = async () => {
    if (!selectedLotId) {
      setError("Selecione uma empresa.");
      return;
    }

    try {
      setGeneratingPdf(true);
      setError(null);

      // GET /lots/{id}/report (retorna PDF em blob)
      const res = await api.get(`/lots/${selectedLotId}/report`, {
        responseType: "blob",
      });

      // Criar blob e baixar
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `relatorio-${selectedLotId}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Erro ao gerar relatório.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return <p>Carregando empresas...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4 text-slate-900">
        Gerar Relatório
      </h1>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Selecione uma empresa
        </label>
        <select
          value={selectedLotId || ""}
          onChange={(e) =>
            setSelectedLotId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">-- Escolha uma empresa --</option>
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.empresa} ({lot.municipio}, {lot.distrito})
            </option>
          ))}
        </select>
      </div>

      {selectedLotId && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800">
          Você selecionou a empresa{" "}
          <strong>
            {lots.find((l) => l.id === selectedLotId)?.empresa}
          </strong>
          . Clique em "Gerar Relatório" para baixar o PDF.
        </div>
      )}

      <button
        onClick={handleGeneratePdf}
        disabled={!selectedLotId || generatingPdf}
        className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium disabled:opacity-60"
      >
        {generatingPdf ? "Gerando..." : "Gerar Relatório em PDF"}
      </button>
    </div>
  );
}
