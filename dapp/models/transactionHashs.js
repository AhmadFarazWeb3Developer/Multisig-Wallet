import pool from "../lib/db";

export async function queueTransaction({
  operation_name,
  operation_description,
  sender_address,
  sender_name,
  tx_hash,
  metadata = {},
}) {
  const client = await pool.connect();

  try {
    const txResult = await client.query(
      `INSERT INTO queued_transactions(
        operation_name,
        operation_description,
        sender_address,
        sender_name,
        tx_hash
      ) VALUES($1,$2,$3,$4,$5) RETURNING tx_id`,
      [
        operation_name,
        operation_description,
        sender_address,
        sender_name,
        tx_hash,
      ]
    );

    const txId = txResult.rows[0].tx_id;

    // Insert metadata dynamically
    for (const [key, value] of Object.entries(metadata)) {
      if (value !== null && value !== undefined) {
        await client.query(
          `INSERT INTO queued_transaction_metadata(tx_hash, key, value)
           VALUES($1, $2, $3)`,
          [tx_hash, key, value]
        );
      }
    }

    return { tx_id: txId };
  } catch (error) {
    console.error("Error queueing transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTransactions() {
  try {
    const result = await pool.query("SELECT * FROM  queued_transactions");
    return result.rows;
  } catch (error) {
    console.error("Error fetching safes:", error);
    throw error;
  }
}
