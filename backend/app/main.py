from fastapi import FastAPI
from app.core.config import settings
from fastapi import Depends
from app.db.auth_db import get_auth_db
from sqlalchemy.orm import Session
from sqlalchemy import text, select
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, LoginRequest, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from jose import JWTError, jwt
from fastapi import HTTPException, status
from datetime import timedelta
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.security import get_current_user, assentamento_required, juridico_required
from fastapi.middleware.cors import CORSMiddleware
from app.models.municipal_lot import MunicipalLot
from app.schemas.municipal_lot import (
    MunicipalLotResponse,
    MunicipalLotUpdate,
    MunicipalLotAssentamentoUpdate,
    MunicipalLotJuridicoUpdate,
    MunicipalLotCreate,
)
from app.db.auth_db import get_auth_db
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from typing import List
from fastapi import Query


app = FastAPI(title=settings.app_name)

origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # origens permitidas (Vite)
    allow_credentials=True,
    allow_methods=["*"],          # permite todos os métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],          # permite todos os headers
)



@app.get("/health")
def read_health():
    return {"status": "ok"}




@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_auth_db)):
    try:
        # Testa se consegue fazer query simples
        result = db.execute(text("SELECT 1")).scalar()
        return {"status": "DB connection OK", "test_query": result}
    except Exception as e:
        return {"status": "DB error", "error": str(e)}


@app.post("/register")
def register_user(user_in: UserCreate, db: Session = Depends(get_auth_db)):
    # Hash da senha
    hashed_password = get_password_hash(user_in.password)
    
    # Criar usuário no banco
    db_user = UserModel(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_password,
        role=user_in.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {
        "status": "user created",
        "user_id": db_user.id,
        "email": db_user.email
    }


@app.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_auth_db)):
    # 1) Buscar usuário pelo email
    user = db.query(UserModel).filter(UserModel.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )

    # 2) Verificar senha
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )

    # 3) Criar token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires,
    )

    return Token(access_token=access_token)


@app.get("/dashboard")
def get_dashboard(current_user: UserModel = Depends(get_current_user)):
    return {
        "message": "Dashboard de exemplo",
        "user_email": current_user.email,
        "user_full_name": current_user.full_name,
    }


@app.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    return current_user


from pydantic import BaseModel


class TokenInput(BaseModel):
    token: str


@app.post("/test-token")
def test_token(body: TokenInput):
    from jose import jwt
    from app.core.security import SECRET_KEY, ALGORITHM

    try:
        payload = jwt.decode(body.token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"valid": True, "payload": payload}
    except Exception as e:
        return {"valid": False, "error": str(e)}

@app.get("/lots/{lot_id}", response_model=MunicipalLotResponse)
def get_lot(
    lot_id: int,
    db: Session = Depends(get_auth_db),
    current_user=Depends(get_current_user),
):
    lot = db.query(MunicipalLot).filter(MunicipalLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return lot


@app.put("/lots/{lot_id}/assentamento", response_model=MunicipalLotResponse)
def update_lot_assentamento(
    lot_id: int,
    lot_in: MunicipalLotAssentamentoUpdate,
    db: Session = Depends(get_auth_db),
    current_user: UserModel = Depends(assentamento_required),
):
    lot = db.query(MunicipalLot).filter(MunicipalLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Registro não encontrado")

    for field, value in lot_in.model_dump(exclude_unset=True).items():
        setattr(lot, field, value)

    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot

@app.put("/lots/{lot_id}/juridico", response_model=MunicipalLotResponse)
def update_lot_juridico(
    lot_id: int,
    lot_in: MunicipalLotJuridicoUpdate,
    db: Session = Depends(get_auth_db),
    current_user: UserModel = Depends(juridico_required),
):
    lot = db.query(MunicipalLot).filter(MunicipalLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Registro não encontrado")

    for field, value in lot_in.model_dump(exclude_unset=True).items():
        setattr(lot, field, value)

    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot

@app.post("/lots", response_model=MunicipalLotResponse)
def create_lot(
    lot_in: MunicipalLotCreate,
    db: Session = Depends(get_auth_db),
    current_user: UserModel = Depends(assentamento_required),
):
    lot = MunicipalLot(**lot_in.model_dump())
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot

@app.get("/lots", response_model=List[MunicipalLotResponse])
def list_lots(
    db: Session = Depends(get_auth_db),
    current_user=Depends(get_current_user),
):
    return db.query(MunicipalLot).order_by(MunicipalLot.empresa).all()

@app.get("/districts", response_model=List[str])
def list_districts(
    db: Session = Depends(get_auth_db),
    current_user=Depends(get_current_user),
):
    rows = (
        db.query(MunicipalLot.distrito)
        .filter(MunicipalLot.distrito.isnot(None))
        .distinct()
        .order_by(MunicipalLot.distrito)
        .all()
    )
    return [row[0] for row in rows]

@app.get("/lots/by-district/{distrito}", response_model=List[MunicipalLotResponse])
def list_lots_by_district(
    distrito: str,
    q: str | None = Query(default=None, description="Filtro por nome de empresa"),
    db: Session = Depends(get_auth_db),
    current_user=Depends(get_current_user),
):
    query = (
        db.query(MunicipalLot)
        .filter(MunicipalLot.distrito == distrito)
    )
    if q:
        like = f"%{q}%"
        query = query.filter(MunicipalLot.empresa.ilike(like))

    return query.order_by(MunicipalLot.empresa).all()