use crate::{models::Contact, AppError, AppResult};
use sqlx::PgPool;
use uuid::Uuid;

pub struct ContactRepository;

impl ContactRepository {
    pub async fn create(pool: &PgPool, contact: Contact) -> AppResult<Contact> {
        let result = sqlx::query_as::<_, Contact>(
            "INSERT INTO contacts (id, user_id, first_name, last_name, email, phone, description, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, user_id, first_name, last_name, email, phone, description, created_at, updated_at"
        )
        .bind(contact.id)
        .bind(contact.user_id)
        .bind(&contact.first_name)
        .bind(&contact.last_name)
        .bind(&contact.email)
        .bind(&contact.phone)
        .bind(&contact.description)
        .bind(contact.created_at)
        .bind(contact.updated_at)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> AppResult<Option<Contact>> {
        let result = sqlx::query_as::<_, Contact>(
            "SELECT id, user_id, first_name, last_name, email, phone, description, created_at, updated_at FROM contacts WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn list_by_user(pool: &PgPool, user_id: Uuid) -> AppResult<Vec<Contact>> {
        let results = sqlx::query_as::<_, Contact>(
            "SELECT id, user_id, first_name, last_name, email, phone, description, created_at, updated_at FROM contacts WHERE user_id = $1 ORDER BY created_at DESC"
        )
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(results)
    }

    pub async fn update(pool: &PgPool, contact: Contact) -> AppResult<Contact> {
        let result = sqlx::query_as::<_, Contact>(
            "UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone = $4, description = $5, updated_at = $6
             WHERE id = $7
             RETURNING id, user_id, first_name, last_name, email, phone, description, created_at, updated_at"
        )
        .bind(&contact.first_name)
        .bind(&contact.last_name)
        .bind(&contact.email)
        .bind(&contact.phone)
        .bind(&contact.description)
        .bind(contact.updated_at)
        .bind(contact.id)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(result)
    }

    pub async fn delete(pool: &PgPool, id: Uuid) -> AppResult<()> {
        sqlx::query("DELETE FROM contacts WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await
            .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(())
    }

    pub async fn search(pool: &PgPool, user_id: Uuid, query: &str) -> AppResult<Vec<Contact>> {
        let search_term = format!("%{}%", query);
        let results = sqlx::query_as::<_, Contact>(
            "SELECT id, user_id, first_name, last_name, email, phone, description, created_at, updated_at
             FROM contacts
             WHERE user_id = $1 AND (
                first_name ILIKE $2 OR
                last_name ILIKE $2 OR
                email ILIKE $2 OR
                phone ILIKE $2
             )
             ORDER BY created_at DESC"
        )
        .bind(user_id)
        .bind(&search_term)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::InternalError(e.to_string()))?;

        Ok(results)
    }
}
