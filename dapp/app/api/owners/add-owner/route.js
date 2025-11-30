import { addOwner } from "../../../../models/owners.model";

export async function POST(req) {
  try {
    const { owner_address, owner_name } = await req.json();

    const result = await addOwner(owner_address, owner_name);

    return Response.json({ status: 200, data: result });
  } catch (error) {
    console.error("Error in GET /api/add-owner:", error);

    return Response.json(
      {
        error: "Failed to fetch safes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
