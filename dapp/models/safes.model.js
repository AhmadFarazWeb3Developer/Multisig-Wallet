import pool from "../lib/db.js";
import { addOwner, linkOwnerToSafe } from "./owners.model.js";

export async function findOwnerSafe(ownerAddress) {
  try {
    const query = `
      SELECT s.*
      FROM safes s
      JOIN safe_owners so ON s.id = so.safe_id
      JOIN owners o ON o.id = so.owner_id
      WHERE LOWER(o.owner_address) = LOWER($1)
    `;

    const { rows } = await pool.query(query, [ownerAddress]);
    console.log("rows ", rows);

    return rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  }
}

export async function getAllSafes() {
  try {
    const result = await pool.query("SELECT * FROM safes ");
    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
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
export async function handleSafeCreation(safe, owners) {
  const newSafe = await createSafe(safe.address, safe.name);

  for (const { address, name } of owners) {
    const owner = await addOwner(address.toLowerCase(), name);
    await linkOwnerToSafe(newSafe.id, owner.id);
  }

  return safe;
}
