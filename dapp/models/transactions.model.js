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

export async function signTransaction({ tx_hash, owner_address, signature }) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO safe_transaction_signatures(tx_hash,owner_address,signature) VALUES($1, $2, $3) RETURNING*",
      [tx_hash, owner_address, signature]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error queueing transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getSignedTransactions() {
  try {
    const result = await pool.query(
      "SELECT * FROM safe_transaction_signatures"
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getSingleHashSignature(tx_hash) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM safe_transaction_signatures WHERE tx_hash = $1 ",
      [tx_hash]
    );

    return result;
  } catch (error) {
    console.error("Error queueing transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTransactions() {
  try {
    const result = await pool.query(`
      SELECT 
        qt.*,
        COALESCE(
          jsonb_object_agg(qtm.key, qtm.value) 
          FILTER (WHERE qtm.key IS NOT NULL), 
        '{}'::jsonb
        ) AS metadata
      FROM queued_transactions qt
      LEFT JOIN queued_transaction_metadata qtm
        ON qt.tx_hash = qtm.tx_hash
      GROUP BY qt.tx_id
      ORDER BY qt.tx_id DESC;
    `);

    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
