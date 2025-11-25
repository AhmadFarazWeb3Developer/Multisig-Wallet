import { storeExecutedTransaction } from "../../../../models/transactions.model";

export async function POST(req) {
  try {
    const payload = await req.json();

    const { tx_id, tx_hash, metadata, operation_name, status } = payload;

    const result = await storeExecutedTransaction({
      tx_id,
      tx_hash,
      metadata,
      operation_name,
      status,
    });

    return Response.json({ status: 200, data: result });
  } catch (error) {
    console.error("Error storing executed transaction:", error);
    return Response.json({ status: 500, error: "Failed to store transaction" });
  }
}
