import { getOwners } from "../../../models/owners.model.js";

export async function GET() {
  try {
    const owners = await getOwners();
    return Response.json(owners);
  } catch (error) {
    console.error("Error in GET /api/owners:", error);

    return Response.json(
      {
        error: "Failed to fetch safes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
