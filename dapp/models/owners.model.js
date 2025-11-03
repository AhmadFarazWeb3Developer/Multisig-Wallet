import pool from "../lib/db";

export async function getOwners() {
  try {
    const result = await pool.query("SELECT * FROM owners  ");
    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  }
}

export async function getSingleOwner(ownerAddress) {
  try {
    const result = await pool.query(
      `SELECT 
       s.safe_address,     
       s.safe_name
     FROM safes s
     JOIN safe_owners so ON s.id = so.safe_id     
     JOIN owners o ON o.id = so.owner_id          
     WHERE o.owner_address = LOWER($1)`,
      [ownerAddress.toLowerCase()]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  }
}

export async function addOwner(ownerAddress, ownerName) {
  const client = await pool.connect();
  try {
    const result = await client.query(
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

export async function linkOwnerToSafe(safeId, ownerId) {
  const client = await pool.connect();
  try {
    // check if this pair already exists
    const existing = await client.query(
      `SELECT 1 FROM safe_owners WHERE safe_id = $1 AND owner_id = $2`,
      [safeId, ownerId]
    );

    if (existing.rowCount === 0) {
      await client.query(
        `INSERT INTO safe_owners (safe_id, owner_id) VALUES ($1, $2)`,
        [safeId, ownerId]
      );
    }
  } catch (error) {
    console.error("Error linking owner to safe:", error);
    throw error;
  } finally {
    client.release();
  }
}
