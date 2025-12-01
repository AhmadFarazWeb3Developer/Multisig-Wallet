import { handleSafeCreation } from "../../../../models/safes.model";

export async function POST(req) {
  const { safe, owners } = await req.json();

  try {
    const result = await handleSafeCreation(safe, owners);
    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json(
      {
        error: "Failed to create safe",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
