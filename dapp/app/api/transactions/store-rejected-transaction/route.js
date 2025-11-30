import { storeRejectedTransaction } from "../../../../models/transactions.model";

export async function POST(req) {
  try {
    const { tx_id, operation_name, sender_address, rejected_by, metadata } =
      await req.json();

    const saved = await storeRejectedTransaction(
      tx_id,
      operation_name,
      sender_address,
      rejected_by,
      metadata
    );

    return Response.json({ status: 200, data: saved });
  } catch (error) {
    console.error("Error storing rejected tx:", error);
    return Response.json(
      { error: "Failed to store rejected transaction" },
      { status: 500 }
    );
  }
}
