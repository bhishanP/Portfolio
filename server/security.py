from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib
from pwdlib import PasswordHash
import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-this")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60


password_hash = PasswordHash.recommended()



# -------- PASSWORD NORMALIZATION --------
# converts ANY length password → fixed safe size

def _pwd_bytes(password: str) -> bytes:
    # normalize unicode and hash first
    return hashlib.sha256(password.encode("utf-8")).digest()


def hash_password(password: str) -> str:
    return password_hash.hash(_pwd_bytes(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(_pwd_bytes(plain_password), hashed_password)


# -------- JWT --------

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return username
    except JWTError:
        return None
