use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{config::AppState, models::User, services::UserService};

pub async fn list(State(state): State<AppState>) -> impl IntoResponse {
    match UserService::list_all(&state.db).await {
        Ok(users) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": users})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn get(State(state): State<AppState>, Path(user_id): Path<Uuid>) -> impl IntoResponse {
    match UserService::get_by_id(&state.db, user_id).await {
        Ok(user) => (StatusCode::OK, Json(json!({"success": true, "data": user}))).into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn update(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    Json(mut payload): Json<User>,
) -> impl IntoResponse {
    payload.id = user_id;
    payload.updated_at = Some(chrono::Utc::now());

    match UserService::update(&state.db, payload.clone()).await {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": payload})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn delete(State(state): State<AppState>, Path(user_id): Path<Uuid>) -> impl IntoResponse {
    match UserService::delete(&state.db, user_id).await {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({"success": true, "message": "Deleted"})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}
