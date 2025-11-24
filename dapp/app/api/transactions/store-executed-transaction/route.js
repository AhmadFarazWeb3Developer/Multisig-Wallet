import { storeExecutedTransaction } from "../../../../models/transactions.model";

export async function POST(req) {
  try {
    const payload = await req.json();
    const { tx_hash } = payload;

    const result = await storeExecutedTransaction({
      tx_hash,
    });

    return Response.json({ status: 200, data: result });
  } catch (error) {}
}
