import { getOwner } from "../../../../models/owners.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  try {
    const owner = await getOwner(address);

    return Response.json(owner, { status: 200 });
  } catch (err) {
    return Response.json({ status: 500, error: err.message });
  }
}
