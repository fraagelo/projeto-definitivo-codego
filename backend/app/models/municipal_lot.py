from sqlalchemy import Column, Integer, String, Float, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class MunicipalLot(Base):
    __tablename__ = "municipal_lots"

    id = Column(Integer, primary_key=True, index=True)

    municipio = Column(String(255), index=True, nullable=False)
    distrito = Column(String(255))
    empresa = Column(String(255))
    cnpj = Column(String(32))
    processo_sei = Column(String(255))
    status_de_assentamento = Column(String(255))
    observacoes = Column(Text)
    ramo_de_atividade = Column(String(255))
    empregos_gerados = Column(Integer)
    observacoes_1 = Column(Text)
    quadra = Column(String(255))
    modulo_s = Column(String(255))
    qtd_modulos = Column(Integer)
    tamanho_m2 = Column(Float)
    matricula_s = Column(String(255))
    obsevacoes = Column(Text)  # conforme o nome que você mandou
    data_escrituracao = Column(Date)
    data_contrato_de_compra_e_venda = Column(Date)
    acao_judicial = Column(String(255))
    taxa_e_ocupacao_do_imovel = Column(Float)  # em %
    imovel_regular_irregular = Column(String(50))
    irregularidades = Column(Text)
    ultima_vistoria = Column(Date)
    observacoes_2 = Column(Text)
    atualizado = Column(Date)
    observacoes_3 = Column(Text)
    processo_judicial = Column(String(255))
    status = Column(String(255))
    assunto_judicial = Column(String(255))
