use crate::{
    dto::user_dto::LoginResponse, models::repositories::UserRepository, AppError, AppResult,
    Claims, JwtManager,
};
use bcrypt::verify;
use sqlx::PgPool;

pub struct AuthService;

impl AuthService {
    pub async fn login(db: &PgPool, email: &str, password: &str) -> AppResult<LoginResponse> {
        let user = UserRepository::find_by_email(db, email)
            .await?
            .ok_or(AppError::UserNotFound)?;

        verify(password, &user.password_hash).map_err(|_| AppError::InvalidPassword)?;

        let token = JwtManager::encode_token(
            user.id.to_string(), // ✅ Uuid → String
            user.username.clone(),
            user.email.clone(),
        )
        .map_err(|e| AppError::InternalError(e))?;

        Ok(LoginResponse {
            user,
            access_token: token,
        })
    }

    pub async fn verify_token(token: &str) -> AppResult<Claims> {
        JwtManager::decode_token(token).map_err(|_| AppError::Unauthorized)
    }
}
