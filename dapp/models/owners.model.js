import pool from "../lib/db";

export async function getOwners() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM owners  ");
    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function addOwner(ownerAddress, ownerName) {
  const client = await pool.connect();
  try {
    const result = await pool.query(
      `INSERT INTO owners (owner_address, owner_name) VALUES ($1, $2) RETURNING *`,
      [ownerAddress, ownerName]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding owner:", error);
    throw error;
  } finally {
    client.release();
  }
}
