import { findOwnerSafe } from "../../../../models/safes.model";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return Response.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    const safes = await findOwnerSafe(walletAddress);

    return Response.json(safes, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/safes/verify-safe:", error);
    return Response.json(
      {
        error: "Failed to verify safe",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
