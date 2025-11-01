import pool from "../lib/db.js";

export async function getAllSafes() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM safes ");
    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  } finally {
    client.release();
  }
}
export async function createSafe(safeAddress, safeName) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `INSERT INTO safes (safe_address, safe_name)
       VALUES ($1, $2)
       RETURNING *`,
      [safeAddress, safeName]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating safe:", error);
    throw error;
  } finally {
    client.release();
  }
}
