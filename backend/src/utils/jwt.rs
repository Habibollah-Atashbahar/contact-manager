use crate::{AppError, AppResult}; // ✅ Claims را حذف کردیم
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub user_id: String,
    pub username: String,
    pub email: String,
    pub exp: usize,
    pub iat: usize,
}

pub struct JwtManager;

impl JwtManager {
    pub fn encode_token(
        user_id: String,
        username: String,
        email: String,
    ) -> Result<String, String> {
        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| {
            "contact_manager_secret_key_2024_very_secure_and_long_string_for_jwt".to_string()
        });

        let now = Utc::now().timestamp() as usize;
        let exp = now + 86400; // 24 hours

        let claims = Claims {
            user_id,
            username,
            email,
            exp,
            iat: now,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .map_err(|e| e.to_string())
    }

    pub fn decode_token(token: &str) -> AppResult<Claims> {
        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| {
            "contact_manager_secret_key_2024_very_secure_and_long_string_for_jwt".to_string()
        });

        decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| AppError::InternalError(format!("Invalid token: {}", e)))
    }
}
