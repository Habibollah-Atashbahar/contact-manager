// use sqlx::postgres::PgPoolOptions;
// use sqlx::PgPool;

// pub async fn init_db() -> Result<PgPool, sqlx::Error> {
//     let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

//     let pool = PgPoolOptions::new()
//         .max_connections(5)
//         .connect(&database_url)
//         .await?;

//     // Test connection
//     sqlx::query("SELECT 1").fetch_one(&pool).await?;

//     println!("✅ Database connected successfully");
//     Ok(pool)
// }

use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

pub async fn init_db() -> Result<PgPool, sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // ✅ اجرای خودکار میگریشن‌ها
    // این خط تمام فایل‌های SQL داخل پوشه migrations را اجرا می‌کند
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to run database migrations: {}", e);
            e
        })?;

    println!("✅ Database connected and migrations applied successfully");
    Ok(pool)
}
