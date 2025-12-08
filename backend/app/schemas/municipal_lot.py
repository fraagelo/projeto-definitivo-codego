from pydantic import BaseModel
from datetime import date
from typing import Optional

class MunicipalLotBase(BaseModel):
    municipio: str
    distrito: Optional[str] = None
    empresa: Optional[str] = None
    cnpj: Optional[str] = None
    processo_sei: Optional[str] = None
    status_assentamento: Optional[str] = None
    observacoes: Optional[str] = None
    ramo_atividade: Optional[str] = None
    empregos_gerados: Optional[int] = None
    observacoes_1: Optional[str] = None
    quadra: Optional[str] = None
    modulos: Optional[str] = None
    qtd_modulos: Optional[int] = None
    tamanho_m2: Optional[float] = None
    matriculas: Optional[str] = None
    obsevacoes: Optional[str] = None
    data_escrituracao: Optional[date] = None
    data_contrato_compra_venda: Optional[date] = None
    acao_judicial: Optional[str] = None
    taxa_ocupacao_imovel: Optional[float] = None
    imovel_regular_irregular: Optional[str] = None
    irregularidades: Optional[str] = None
    ultima_vistoria: Optional[date] = None
    observacoes_2: Optional[str] = None
    atualizado: Optional[date] = None
    observacoes_3: Optional[str] = None
    processo_judicial: Optional[str] = None
    status: Optional[str] = None
    assunto_judicial: Optional[str] = None

class MunicipalLotUpdate(MunicipalLotBase):
    pass

class MunicipalLotResponse(MunicipalLotBase):
    id: int

    class Config:
        from_attributes = True
