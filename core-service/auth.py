from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

SECRET_KEY = "RockStoreSuperSecretKeyParaDesarrollo2026jaja"
ALGORITH = "HS256"
ISSUER = "RockStoreAuthService"
AUDIENCE = "RockStoreClients"

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITH],
            audience=AUDIENCE,
            issuer=ISSUER
        )

        user_id_claim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        user_id: str = payload.get(user_id_claim)

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="El token no corresponde con el ID del usuario"
            )

        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesion expirada. Por favor iniciar nuevamente"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no valido"
        )