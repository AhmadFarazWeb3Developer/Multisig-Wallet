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
  } catch (err) {
    console.error("Error storing executed transaction:", err);
    return Response.json(
      {
        error: "Failed store executed transaction",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
