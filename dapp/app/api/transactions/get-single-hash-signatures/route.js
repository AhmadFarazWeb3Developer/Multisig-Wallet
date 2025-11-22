import { getSingleHashSignature } from "../../../../models/transactions.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const tx_hash = searchParams.get("tx_hash");

  try {
    const signatures = await getSingleHashSignature(tx_hash);
    console.log(signatures);
    return Response.json(signatures, { status: 200 });
  } catch (err) {
    return Response.json({ status: 500, error: err.message });
  }
}
