import { getRejectedTransactions } from "../../../../models/transactions.model";

export async function GET() {
  try {
    const transactions = await getRejectedTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (err) {
    return Response.json({ status: 500, error: err.message });
  }
}
