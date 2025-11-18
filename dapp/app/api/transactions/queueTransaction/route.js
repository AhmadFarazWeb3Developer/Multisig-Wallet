import { queueTransaction } from "../../../../models/transactionHashs";

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      operation_name,
      operation_description,
      sender_address,
      sender_name,
      tx_hash,
    } = payload;

    if (
      !operation_name ||
      !operation_description ||
      !sender_address ||
      !sender_name ||
      !tx_hash
    ) {
      return Response.json(
        { status: 400, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await queueTransaction(
      operation_name,
      operation_description,
      sender_address,
      sender_name,
      tx_hash
    );

    return Response.json({ status: 200, data: result });
  } catch (err) {
    console.error("Error in POST /queueTransaction:", err);
    return Response.json({ status: 500, error: err.message });
  }
}
