use crate::{models::User, AppError, AppResult};
use sqlx::PgPool;
use uuid::Uuid;

pub struct UserRepository;

impl UserRepository {
    pub async fn create(pool: &PgPool, user: User) -> AppResult<User> {
        let result = sqlx::query_as::<_, User>(
            "INSERT INTO users (id, username, email, password_hash, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username, email, password_hash, created_at, updated_at",
        )
        .bind(user.id)
        .bind(&user.username)
        .bind(&user.email)
        .bind(&user.password_hash)
        .bind(user.created_at)
        .bind(user.updated_at)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn find_by_email(pool: &PgPool, email: &str) -> AppResult<Option<User>> {
        let result = sqlx::query_as::<_, User>(
            "SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1"
        )
        .bind(email)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> AppResult<Option<User>> {
        let result = sqlx::query_as::<_, User>(
            "SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn update(pool: &PgPool, user: User) -> AppResult<User> {
        let result = sqlx::query_as::<_, User>(
            "UPDATE users SET username = $1, email = $2, updated_at = $3
             WHERE id = $4
             RETURNING id, username, email, password_hash, created_at, updated_at",
        )
        .bind(&user.username)
        .bind(&user.email)
        .bind(user.updated_at)
        .bind(user.id)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn delete(pool: &PgPool, id: Uuid) -> AppResult<()> {
        sqlx::query("DELETE FROM users WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await
            .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(())
    }

    pub async fn list_all(pool: &PgPool) -> AppResult<Vec<User>> {
        let results = sqlx::query_as::<_, User>(
            "SELECT id, username, email, password_hash, created_at, updated_at FROM users",
        )
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(results)
    }
}
