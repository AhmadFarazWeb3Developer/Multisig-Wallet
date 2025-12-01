import { queueTransaction } from "../../../../models/transactions.model";

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      operation_name,
      operation_description,
      sender_address,
      sender_name,
      metadata = {},
    } = payload;

    if (
      !operation_name ||
      !operation_description ||
      !sender_address ||
      !sender_name
    ) {
      return Response.json(
        { status: 400, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await queueTransaction({
      operation_name,
      operation_description,
      sender_address,
      sender_name,
      metadata,
    });

    return Response.json({ status: 200, data: result });
  } catch (err) {
    console.error("Error in POST /queueTransaction:", err);

    if (err.code === "23505") {
      return Response.json(
        { status: 409, error: "This transaction hash is already queued." },
        { status: 409 }
      );
    }

    return Response.json(
      {
        error: "Failed to queue transaction",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
