import { createSafe } from "../../../../models/safes.model";

export async function POST(res, req) {
  const { safeAddress, safeName } = await req.json();

  try {
    const result = await createSafe(safeAddress, safeName);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
