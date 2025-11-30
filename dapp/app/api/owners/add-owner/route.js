import { addOwner, linkOwnerToSafe } from "../../../../models/owners.model";
import { getSafeByAddress } from "../../../../models/safes.model";

export async function POST(req) {
  try {
    const { safe, owner_address } = await req.json();

    const safeId = await getSafeByAddress(safe);
    const newOwner = await addOwner(owner_address);

    await linkOwnerToSafe(safeId.id, newOwner.id);

    return Response.json({ status: 200, data: newOwner });
  } catch (error) {
    console.error("Error in POST /api/add-owner:", error);
    return Response.json(
      {
        error: "Failed to add owner",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
