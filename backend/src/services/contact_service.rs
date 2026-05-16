use crate::{
    models::{repositories::ContactRepository, Contact},
    AppResult,
};
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub struct ContactService;

impl ContactService {
    pub async fn create(
        db: &PgPool,
        user_id: Uuid,
        first_name: String,
        last_name: String,
        email: Option<String>,
        phone: Option<String>,
        description: Option<String>,
    ) -> AppResult<Contact> {
        let contact = Contact {
            id: Uuid::new_v4(), // ✅ بدون .to_string()
            user_id,
            first_name,
            last_name,
            email,
            phone,
            description,
            created_at: Some(Utc::now()),
            updated_at: Some(Utc::now()),
        };

        ContactRepository::create(db, contact).await
    }

    pub async fn list(db: &PgPool, user_id: Uuid) -> AppResult<Vec<Contact>> {
        ContactRepository::list_by_user(db, user_id).await
    }

    pub async fn search(db: &PgPool, user_id: Uuid, query: &str) -> AppResult<Vec<Contact>> {
        ContactRepository::search(db, user_id, query).await
    }
}
