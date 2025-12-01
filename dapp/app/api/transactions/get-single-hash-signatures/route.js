import { getSingleHashSignature } from "../../../../models/transactions.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const tx_id = searchParams.get("tx_id");

  try {
    const signatures = await getSingleHashSignature(tx_id);

    return Response.json(signatures, { status: 200 });
  } catch (err) {
    return Response.json(
      {
        error: "Failed get single hash signatures",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
