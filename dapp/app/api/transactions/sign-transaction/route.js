import { signTransaction } from "../../../../models/transactions.model";

export async function POST(req) {
  try {
    const payload = await req.json();

    const { tx_id, owner_address, signature } = payload;

    if (!signature || !owner_address || !tx_id) {
      return Response.json(
        { status: 400, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await signTransaction({
      tx_id,
      owner_address,
      signature,
    });

    return Response.json({ status: 200, data: result });
  } catch (err) {
    console.error("Error in POST /queueTransaction:", err);

    if (err.code === "23505") {
      return Response.json(
        { status: 409, error: "You have already signed this transaction." },
        { status: 409 }
      );
    }

    return Response.json(
      {
        error: "Failed sign transactions",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
