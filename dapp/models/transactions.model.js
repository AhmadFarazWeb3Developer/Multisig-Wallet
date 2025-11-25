import pool from "../lib/db";

export async function queueTransaction({
  operation_name,
  operation_description,
  sender_address,
  sender_name,
  metadata = {},
}) {
  const client = await pool.connect();

  try {
    const txResult = await client.query(
      `INSERT INTO queued_transactions(
        operation_name,
        operation_description,
        sender_address,
        sender_name
      ) VALUES($1,$2,$3,$4) RETURNING tx_id`,
      [operation_name, operation_description, sender_address, sender_name]
    );

    const txId = txResult.rows[0].tx_id;

    for (const [key, value] of Object.entries(metadata)) {
      if (value !== null && value !== undefined) {
        await client.query(
          `INSERT INTO queued_transaction_metadata(tx_id, meta_key, meta_value)
           VALUES($1, $2, $3)`,
          [txId, key, value]
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

export async function signTransaction({ tx_id, owner_address, signature }) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO safe_transaction_signatures(tx_id,owner_address,signature) VALUES($1, $2, $3) RETURNING*",
      [tx_id, owner_address, signature]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error queueing transaction:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function storeExecutedTransaction({
  tx_id,
  tx_hash,
  metadata,
  operation_name,
  status,
}) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `INSERT INTO executed_transactions
        (tx_id, tx_hash, metadata, operation_name, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tx_id, tx_hash, JSON.stringify(metadata), operation_name, status]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error storing executed transaction:", error);
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

export async function getSingleHashSignature(tx_id) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM safe_transaction_signatures WHERE tx_id = $1 ",
      [tx_id]
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
          jsonb_object_agg(qtm.meta_key, qtm.meta_value) 
          FILTER (WHERE qtm.meta_key IS NOT NULL), 
        '{}'::jsonb
        ) AS metadata
      FROM queued_transactions qt
      LEFT JOIN queued_transaction_metadata qtm
        ON qt.tx_id = qtm.tx_id
      GROUP BY qt.tx_id
      ORDER BY qt.tx_id DESC;
    `);

    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getExecutedTransactions() {
  try {
    const result = await pool.query("SELECT * FROM executed_transactions");

    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
