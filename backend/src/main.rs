use axum::{
    routing::{delete, get, post, put},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

use contact_management::{
    config::{init_db, AppState},
    handlers::{auth, contacts, users},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();

    println!("🚀 Starting Contact Management API...");

    // Initialize database
    let db = init_db().await?;
    let state = AppState::new(db);

    // CORS Configuration
    let cors = CorsLayer::permissive();

    let app = Router::new()
        // Auth Routes
        .route("/api/auth/register", post(auth::register))
        .route("/api/auth/login", post(auth::login))
        .route("/api/auth/logout", post(auth::logout))
        .route("/api/auth/verify-token", get(auth::verify_token))
        .route("/api/auth/refresh-token", post(auth::refresh_token))
        .route("/api/auth/forgot-password", post(auth::forgot_password))
        // Contact Routes
        .route("/api/contacts/{user_id}", get(contacts::list))
        .route("/api/contacts/{user_id}", post(contacts::create))
        .route("/api/contacts/{user_id}/{contact_id}", get(contacts::get))
        .route(
            "/api/contacts/{user_id}/{contact_id}",
            put(contacts::update),
        )
        .route(
            "/api/contacts/{user_id}/{contact_id}",
            delete(contacts::delete),
        )
        .route("/api/contacts/{user_id}/search", get(contacts::search))
        // User Routes
        .route("/api/users", get(users::list))
        .route("/api/users/{user_id}", get(users::get))
        .route("/api/users/{user_id}", put(users::update))
        .route("/api/users/{user_id}", delete(users::delete))
        .layer(cors)
        .with_state(state);

    let host = std::env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("SERVER_PORT").unwrap_or_else(|_| "3000".to_string());
    let addr: SocketAddr = format!("{}:{}", host, port).parse()?;

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    println!("✅ Server running at http://{}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}
