import { getSafesByOwner } from "../../../../models/owners.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ownerAddress = searchParams.get("address");
  try {
    const result = await getSafesByOwner(ownerAddress);
    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/get-safes-by-owner:", err);
    return Response.json(
      {
        error: "Failed to get owner from safe ",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
