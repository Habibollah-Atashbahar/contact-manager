use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::json;
use uuid::Uuid;

use crate::{
    config::AppState,
    dto::LoginRequest,
    dto::RegisterRequest,
    models::{repositories::UserRepository, User},
    services::AuthService,
};

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
    if let Ok(Some(_)) = UserRepository::find_by_email(&state.db, &payload.email).await {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"success": false, "message": "ایمیل قبلاً ثبت شده است"})),
        )
            .into_response();
    }

    let user_id = Uuid::new_v4();
    match User::new(user_id, payload.username, payload.email, payload.password) {
        Ok(user) => match UserRepository::create(&state.db, user.clone()).await {
            Ok(_) => (
                StatusCode::CREATED,
                Json(json!({"success": true, "data": user})),
            )
                .into_response(),
            Err(e) => e.into_response(),
        },
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"success": false, "message": e})),
        )
            .into_response(),
    }
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    match AuthService::login(&state.db, &payload.email, &payload.password).await {
        Ok(response) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": response})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn logout() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({"success": true, "message": "Logged out"})),
    )
}

pub async fn verify_token() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({"success": true, "data": {"valid": true}})),
    )
}

pub async fn refresh_token() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({"success": true, "data": {"access_token": "new_token"}})),
    )
}

pub async fn forgot_password() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({"success": true, "message": "Email sent"})),
    )
}
