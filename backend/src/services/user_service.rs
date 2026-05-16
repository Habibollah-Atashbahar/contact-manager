use crate::{
    models::{repositories::UserRepository, User},
    AppResult,
};
use sqlx::PgPool;
use uuid::Uuid;

pub struct UserService;

impl UserService {
    pub async fn get_by_id(db: &PgPool, id: Uuid) -> AppResult<User> {
        UserRepository::find_by_id(db, id)
            .await?
            .ok_or(crate::AppError::UserNotFound)
    }

    pub async fn list_all(db: &PgPool) -> AppResult<Vec<User>> {
        UserRepository::list_all(db).await
    }

    pub async fn update(db: &PgPool, user: User) -> AppResult<User> {
        UserRepository::update(db, user).await
    }

    pub async fn delete(db: &PgPool, id: Uuid) -> AppResult<()> {
        UserRepository::delete(db, id).await
    }
}
