import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";


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
  const { user } = useAuth();
  const isAssentamento = user?.role === "assentamento";
  const isJuridico = user?.role === "juridico";
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);


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
    if (!lot || !user) return;

    try {
      setSaving(true);
      setError(null);
      if (isAssentamento) {
        const body = {
          municipio: lot.municipio,
          distrito: lot.distrito,
          empresa: lot.empresa,
          cnpj: lot.cnpj,
          processo_sei: lot.processo_sei,
          status_assentamento: lot.status_assentamento,
          observacoes: lot.observacoes,
          ramo_atividade: lot.ramo_atividade,
          empregos_gerados: lot.empregos_gerados,
          observacoes_1: lot.observacoes_1,
          quadra: lot.quadra,
          modulos: lot.modulos,
          qtd_modulos: lot.qtd_modulos,
          tamanho_m2: lot.tamanho_m2,
          matriculas: lot.matriculas,
          obsevacoes: lot.obsevacoes,
          data_escrituracao: lot.data_escrituracao,
          data_contrato_compra_venda: lot.data_contrato_compra_venda,
        };
        await api.put(`/lots/${id}/assentamento`, body);
      } else if (isJuridico) {
        const body = {
          acao_judicial: lot.acao_judicial,
          taxa_ocupacao_imovel: lot.taxa_ocupacao_imovel,
          imovel_regular_irregular: lot.imovel_regular_irregular,
          irregularidades: lot.irregularidades,
          ultima_vistoria: lot.ultima_vistoria,
          observacoes_2: lot.observacoes_2,
          atualizado: lot.atualizado,
          observacoes_3: lot.observacoes_3,
          processo_judicial: lot.processo_judicial,
          status: lot.status,
          assunto_judicial: lot.assunto_judicial,
        };
        await api.put(`/lots/${id}/juridico`, body);
      } else {
        setError("Seu usuário não tem permissão para editar estes dados.");
        return;
      }
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
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 text-sm">
          <button type="button" onClick={() => setStep(1)} className={step === 1 ? "font-semibold" : ""}>
            1. Dados gerais
          </button>
          <button type="button" onClick={() => setStep(2)} className={step === 2 ? "font-semibold" : ""}>
            2. Empregos e área
          </button>
          <button type="button" onClick={() => setStep(3)} className={step === 3 ? "font-semibold" : ""}>
            3. Dados jurídicos  
          </button>
        </div>

        {step === 1 && (
          <div>
            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Município
            </label>
            <input
              name="municipio"
              value={lot.municipio}
              onChange={handleChange}
              disabled={!isAssentamento}
              className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
              disabled={!isAssentamento}
              className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
              disabled={!isAssentamento}
              className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observações (Status assentamento)
                </label>
                <input
                  name="observacoes"
                  value={lot.observacoes ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ramo de atividade
              </label>
              <input
                  name="ramo_atividade"
                  value={lot.ramo_atividade ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observações (Empregos / atividade)
                </label>
                <input
                  name="observacoes_1"
                  value={lot.observacoes_1 ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observações (matrícula / área)
                </label>
                <input
                  name="obsevacoes"
                  value={lot.obsevacoes ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Data da escrituração
                </label>
                <input
                  type="date"
                  name="data_escrituracao"
                  value={lot.data_escrituracao ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Data contrato de compra e venda
                </label>
                <input
                  type="date"
                  name="data_contrato_compra_venda"
                  value={lot.data_contrato_compra_venda ?? ""}
                  onChange={handleChange}
                  disabled={!isAssentamento}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Ação judicial
            </label>
            <input
                name="acao_judicial"
                value={lot.acao_judicial ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            </div>

            <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Irregularidades
            </label>
            <input
                name="irregularidades"
                value={lot.irregularidades ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Última vistoria
              </label>
              <input
                type="date"
                name="ultima_vistoria"
                value={lot.ultima_vistoria ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Observações (vistoria / irregularidades)
              </label>
              <input
                name="observacoes_2"
                value={lot.observacoes_2 ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data de atualização
              </label>
              <input
                type="date"
                name="atualizado"
                value={lot.atualizado ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Observações gerais (jurídico)
              </label>
              <input
                name="observacoes_3"
                value={lot.observacoes_3 ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Processo judicial
              </label>
              <input
                name="processo_judicial"
                value={lot.processo_judicial ?? ""}
                onChange={handleChange}
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                disabled={!isJuridico}
                className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancelar
          </button>
        </div>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-3 py-2 text-sm border rounded"
              >
                Voltar
              </button>

            )}

            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="px-3 py-2 text-sm bg-slate-200 rounded"
              >
                Próximo
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            )}
        </div>
      </form>
    </div>
  );
}
