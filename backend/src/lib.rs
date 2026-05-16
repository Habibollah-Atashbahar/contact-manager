pub mod config;
pub mod dto;
pub mod handlers;
pub mod middleware;
pub mod models;
pub mod services;
pub mod utils;

// ✅ Export types
pub use models::User;
pub use utils::errors::{AppError, AppResult};
pub use utils::jwt::Claims;
pub use utils::jwt::JwtManager;
