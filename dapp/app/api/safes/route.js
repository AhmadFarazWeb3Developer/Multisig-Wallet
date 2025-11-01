import { getAllSafes } from "../../../models/safe.model.js";

export async function GET() {
  try {
    const safes = await getAllSafes();

    return Response.json(safes);
  } catch (error) {
    console.error("Error in GET /api/safes:", error);
    return Response.json(
      {
        error: "Failed to fetch safes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
