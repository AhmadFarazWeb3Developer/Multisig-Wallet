import { addOwner } from "../../../../models/owners.model";

export async function POST(res, req) {
  const { ownerAddress, ownerName } = await req.json();

  try {
    const result = await addOwner(ownerAddress, ownerName);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
