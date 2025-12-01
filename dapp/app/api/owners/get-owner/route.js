import { getOwner } from "../../../../models/owners.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  try {
    const owner = await getOwner(address);

    return Response.json(owner, { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/get-owner:", error);
    return Response.json(
      {
        error: "Failed to get owner",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
