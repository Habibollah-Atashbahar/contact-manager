use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    ValidationError(String),
    InvalidPassword,
    UserNotFound,
    Unauthorized,
    InternalError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::ValidationError(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::InvalidPassword => (
                StatusCode::UNAUTHORIZED,
                "ایمیل یا رمز عبور نادرست".to_string(),
            ),
            AppError::UserNotFound => (StatusCode::NOT_FOUND, "کاربر یافت نشد".to_string()),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, "غیرمجاز".to_string()),
            AppError::InternalError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (status, Json(json!({"success": false, "message": message}))).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
