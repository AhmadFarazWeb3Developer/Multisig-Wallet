import { updateOwnerName } from "../../../../models/owners.model";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { owner_address, owner_name } = body;

    console.log(owner_address);
    console.log(owner_name);
    console.log("API HIT🔥");

    if (!owner_address || !owner_name) {
      return Response.json(
        { error: "address and name are required" },
        { status: 400 }
      );
    }

    const updated = await updateOwnerName(owner_address, owner_name);

    return Response.json({ success: true, updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/owners/update-name:", error);
    return Response.json(
      { error: "Failed to update owner name" },
      { status: 500 }
    );
  }
}
