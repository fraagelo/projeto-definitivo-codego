from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional

class MunicipalLotBase(BaseModel):
    municipio: str
    distrito: Optional[str] = None
    empresa: Optional[str] = None
    cnpj: Optional[str] = None
    processo_sei: Optional[int] = None
    status_de_assentamento: Optional[str] = None
    observacoes: Optional[str] = None
    ramo_de_atividade: Optional[str] = None
    empregos_gerados: Optional[int] = None
    observacoes_1: Optional[str] = None
    quadra: Optional[int] = None
    modulo_s: Optional[str] = None
    qtd_modulos: Optional[int] = None
    tamanho_m2: Optional[float] = None
    matricula_s: Optional[int] = None
    obsevacoes: Optional[str] = None
    data_escrituracao: Optional[str] = None
    data_contrato_de_compra_e_venda: Optional[str] = None
    acao_judicial: Optional[str] = None
    taxa_e_ocupacao_do_imovel: Optional[float] = None
    imovel_regular_irregular: Optional[str] = None
    irregularidades: Optional[str] = None
    ultima_vistoria: Optional[str] = None
    observacoes_2: Optional[str] = None
    atualizado: Optional[str] = None
    observacoes_3: Optional[str] = None
    processo_judicial: Optional[str] = None
    status: Optional[str] = None
    assunto_judicial: Optional[str] = None

class MunicipalLotAssentamentoUpdate(BaseModel):
    municipio: Optional[str] = None
    distrito: Optional[str] = None
    empresa: Optional[str] = None
    cnpj: Optional[str] = None
    processo_sei: Optional[int] = None
    status_de_assentamento: Optional[str] = None
    observacoes: Optional[str] = None
    ramo_de_atividade: Optional[str] = None
    empregos_gerados: Optional[int] = None
    observacoes_1: Optional[str] = None
    quadra: Optional[int] = None
    modulo_s: Optional[str] = None
    qtd_modulos: Optional[int] = None
    tamanho_m2: Optional[float] = None
    matricula_s: Optional[int] = None
    obsevacoes: Optional[str] = None
    data_escrituracao: Optional[str] = None
    data_contrato_de_compra_e_venda: Optional[str] = None

    @field_validator("empregos_gerados")
    @classmethod
    def validate_empregos(cls, v: Optional[int]) -> Optional[int]:
        if v is None:
            return v
        if v < 0:
            raise ValueError("Empregos gerados não pode ser negativo.")
        if v > 100000:
            raise ValueError("Empregos gerados está muito alto; verifique o valor.")
        return v
    
    @field_validator("cnpj")
    @classmethod
    def validate_cnpj(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return v
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) != 14:
            raise ValueError("CNPJ deve ter 14 dígitos (apenas números).")
        return v

class MunicipalLotJuridicoUpdate(BaseModel):
    acao_judicial: Optional[str] = None
    taxa_e_ocupacao_do_imovel: Optional[float] = None
    imovel_regular_irregular: Optional[str] = None
    irregularidades: Optional[str] = None
    ultima_vistoria: Optional[str] = None
    observacoes_2: Optional[str] = None
    atualizado: Optional[str] = None
    observacoes_3: Optional[str] = None
    processo_judicial: Optional[str] = None
    status: Optional[str] = None
    assunto_judicial: Optional[str] = None

    @field_validator("taxa_e_ocupacao_do_imovel")
    @classmethod
    def validate_taxa(cls, v: Optional[float]) -> Optional[float]:
        if v is None:
            return v
        if v < 0 or v > 100:
            raise ValueError("A taxa de ocupação deve estar entre 0 e 100.")
        return v


class MunicipalLotUpdate(MunicipalLotBase):
    pass

class MunicipalLotResponse(MunicipalLotBase):
    id: int

    class Config:
        from_attributes = True


class MunicipalLotCreate(BaseModel):
    municipio: str
    empresa: str
    cnpj: Optional[str] = None
    distrito: Optional[str] = None
