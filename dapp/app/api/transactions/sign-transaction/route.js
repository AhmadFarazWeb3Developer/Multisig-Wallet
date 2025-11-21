export async function POST(req) {
  try {
    const payload = await req.json();

    const { tx_hash, owner_address, signature } = payload;

    if (!signature || !owner_address || !tx_hash) {
      return Response.json(
        { status: 400, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await signTransaction({
      signature,
      owner_address,
      tx_hash,
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

    return Response.json({ status: 500, error: err.message }, { status: 500 });
  }
}
