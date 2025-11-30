import { removeOwner } from "../../../../models/owners.model";

export async function POST(req) {
  try {
    let { remove_owner } = await req.json();
    remove_owner = remove_owner.toLowerCase().trim();

    const result = await removeOwner(remove_owner);

    return Response.json({ status: 200, result });
  } catch (error) {
    console.error("Error in POST /api/remove-owner:", error);

    return Response.json(
      {
        error: "Failed to update owner",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
