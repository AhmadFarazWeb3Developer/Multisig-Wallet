import { swapOwnerAddress } from "../../../../models/owners.model";

export async function PUT(req) {
  try {
    let { old_owner_address, new_owner_address } = await req.json();

    old_owner_address = old_owner_address.toLowerCase().trim();
    new_owner_address = new_owner_address.toLowerCase().trim();

    const result = await swapOwnerAddress(old_owner_address, new_owner_address);

    return Response.json({ status: 200, data: result });
  } catch (error) {
    console.error("Error in PUT /api/swap-owner:", error);
    return Response.json(
      {
        error: "Failed to update owner",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
