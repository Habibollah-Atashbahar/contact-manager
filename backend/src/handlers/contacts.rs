use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

use crate::{
    config::AppState,
    dto::CreateContactRequest,
    models::{repositories::ContactRepository, Contact},
};

pub async fn list(State(state): State<AppState>, Path(user_id): Path<Uuid>) -> impl IntoResponse {
    match ContactRepository::list_by_user(&state.db, user_id).await {
        Ok(contacts) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": {"data": contacts, "total": contacts.len()}})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn create(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    Json(payload): Json<CreateContactRequest>,
) -> impl IntoResponse {
    let contact = Contact {
        id: Uuid::new_v4(),
        user_id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone,
        description: payload.description,
        created_at: Some(Utc::now()),
        updated_at: Some(Utc::now()),
    };

    match ContactRepository::create(&state.db, contact.clone()).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(json!({"success": true, "data": contact})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn get(
    State(state): State<AppState>,
    Path((_user_id, contact_id)): Path<(Uuid, Uuid)>,
) -> impl IntoResponse {
    match ContactRepository::find_by_id(&state.db, contact_id).await {
        Ok(Some(contact)) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": contact})),
        )
            .into_response(),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({"success": false, "message": "Contact not found"})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn update(
    State(state): State<AppState>,
    Path((_user_id, contact_id)): Path<(Uuid, Uuid)>,
    Json(payload): Json<CreateContactRequest>,
) -> impl IntoResponse {
    match ContactRepository::find_by_id(&state.db, contact_id).await {
        Ok(Some(mut contact)) => {
            contact.first_name = payload.first_name;
            contact.last_name = payload.last_name;
            contact.email = payload.email;
            contact.phone = payload.phone;
            contact.description = payload.description;
            contact.updated_at = Some(Utc::now());

            match ContactRepository::update(&state.db, contact.clone()).await {
                Ok(_) => (
                    StatusCode::OK,
                    Json(json!({"success": true, "data": contact})),
                )
                    .into_response(),
                Err(e) => e.into_response(),
            }
        }
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({"success": false, "message": "Contact not found"})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn delete(
    State(state): State<AppState>,
    Path((_user_id, contact_id)): Path<(Uuid, Uuid)>,
) -> impl IntoResponse {
    match ContactRepository::delete(&state.db, contact_id).await {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({"success": true, "message": "Deleted"})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn search(State(state): State<AppState>, Path(user_id): Path<Uuid>) -> impl IntoResponse {
    match ContactRepository::list_by_user(&state.db, user_id).await {
        Ok(contacts) => (
            StatusCode::OK,
            Json(json!({"success": true, "data": {"data": contacts, "total": contacts.len(), "query": ""}})),
        )
            .into_response(),
        Err(e) => e.into_response(),
    }
}
