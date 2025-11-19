import { queueTransaction } from "../../../../models/transactionHashs";

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      operation_name,
      amount,
      amount_to,
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
      amount,
      amount_to,
      operation_description,
      sender_address,
      sender_name,
      tx_hash
    );

    return Response.json({ status: 200, data: result });
  } catch (err) {
    console.error("Error in POST /queueTransaction:", err);

    // Detect duplicate key error
    if (err.code === "23505") {
      return Response.json(
        { error: "This transaction hash is already queued." },
        { status: 409 }
      );
    }

    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
