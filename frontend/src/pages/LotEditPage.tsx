import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

type Lot = {
  id: number;
  municipio: string;
  distrito?: string | null;
  empresa?: string | null;
  cnpj?: string | null;
  processo_sei?: string | null;
  status_assentamento?: string | null;
  observacoes?: string | null;
  ramo_atividade?: string | null;
  empregos_gerados?: number | null;
  observacoes_1?: string | null;
  quadra?: string | null;
  modulos?: string | null;
  qtd_modulos?: number | null;
  tamanho_m2?: number | null;
  matriculas?: string | null;
  obsevacoes?: string | null;
  data_escrituracao?: string | null;
  data_contrato_compra_venda?: string | null;
  acao_judicial?: string | null;
  taxa_ocupacao_imovel?: number | null;
  imovel_regular_irregular?: string | null;
  irregularidades?: string | null;
  ultima_vistoria?: string | null;
  observacoes_2?: string | null;
  atualizado?: string | null;
  observacoes_3?: string | null;
  processo_judicial?: string | null;
  status?: string | null;
  assunto_judicial?: string | null;
};

export function LotEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLot = async () => {
      try {
        const response = await api.get(`/lots/${id}`);
        setLot(response.data);
      } catch {
        setError("Erro ao carregar dados do registro.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLot();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!lot) return;
    const { name, value } = e.target;
    setLot({ ...lot, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lot) return;

    try {
      setSaving(true);
      setError(null);
      await api.put(`/lots/${id}`, lot);
      alert("Dados atualizados com sucesso.");
      navigate("/dashboard");
    } catch {
      setError("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (!lot) {
    return <p>Registro não encontrado.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4 text-slate-900">
        Editar registro #{lot.id}
      </h1>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Município
          </label>
          <input
            name="municipio"
            value={lot.municipio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Distrito
          </label>
          <input
            name="distrito"
            value={lot.distrito ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Empresa
          </label>
          <input
            name="empresa"
            value={lot.empresa ?? ""}
            readOnly
            className="w-full border rounded px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            CNPJ
          </label>
          <input
            name="cnpj"
            value={lot.cnpj ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Processo SEI
            </label>
            <input
                name="processo_sei"
                value={lot.processo_sei ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Status de assentamento
            </label>
            <input
                name="status_assentamento"
                value={lot.status_assentamento ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Ramo de atividade
            </label>
            <input
                name="ramo_atividade"
                value={lot.ramo_atividade ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Empregos gerados
            </label>
            <input
                type="number"
                name="empregos_gerados"
                value={lot.empregos_gerados ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Quadra
            </label>
            <input
                name="quadra"
                value={lot.quadra ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Módulo(s)
            </label>
            <input
                name="modulos"
                value={lot.modulos ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Qtd. módulos
            </label>
            <input
                type="number"
                name="qtd_modulos"
                value={lot.qtd_modulos ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Tamanho (m²)
            </label>
            <input
                type="number"
                step="0.01"
                name="tamanho_m2"
                value={lot.tamanho_m2 ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Matrícula(s)
            </label>
            <input
                name="matriculas"
                value={lot.matriculas ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Ação judicial
            </label>
            <input
                name="acao_judicial"
                value={lot.acao_judicial ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Taxa de ocupação do imóvel (%)
            </label>
            <input
                type="number"
                step="0.01"
                name="taxa_ocupacao_imovel"
                value={lot.taxa_ocupacao_imovel ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Imóvel regular/irregular
            </label>
            <input
                name="imovel_regular_irregular"
                value={lot.imovel_regular_irregular ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Irregularidades
            </label>
            <textarea
                name="irregularidades"
                value={lot.irregularidades ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Status
            </label>
            <input
                name="status"
                value={lot.status ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Assunto judicial
            </label>
            <input
                name="assunto_judicial"
                value={lot.assunto_judicial ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
            />
            </div>
        {/* Repita esse padrão para os campos que mais interessam agora.
           Você não é obrigado a expor todos de uma vez. */}

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={lot.observacoes ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
