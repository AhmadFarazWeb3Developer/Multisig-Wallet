import pool from "../lib/db";

export async function queueTransaction(
  operation_name,
  operation_description,
  sender_address,
  sender_name,
  tx_hash
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO tx_hash(operation_name, operation_description, sender_address, sender_name, tx_hash) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [
        operation_name,
        operation_description,
        sender_address,
        sender_name,
        tx_hash,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}
