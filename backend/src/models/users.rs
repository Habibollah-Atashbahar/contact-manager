use bcrypt::hash;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl User {
    pub fn new(
        id: Uuid,
        username: String,
        email: String,
        password: String,
    ) -> Result<Self, String> {
        let password_hash = hash(&password, 10).map_err(|e| e.to_string())?;
        Ok(User {
            id,
            username,
            email,
            password_hash,
            created_at: Some(Utc::now()),
            updated_at: Some(Utc::now()),
        })
    }
}
