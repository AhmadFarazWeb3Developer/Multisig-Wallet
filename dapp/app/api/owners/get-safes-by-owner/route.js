import { getSafesByOwner } from "../../../../models/owners.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ownerAddress = searchParams.get("address");
  try {
    const result = await getSafesByOwner(ownerAddress);
    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json({ status: 500, error: err.message });
  }
}
