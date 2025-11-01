import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DB_URL is required");
}

console.log("Database connection string loaded");

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  //   connectionTimeoutMillis: 10000,
  //   idleTimeoutMillis: 30000,
  //   max: 10,
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

export default pool;
