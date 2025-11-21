import { getSignedTransactions } from "../../../../models/transactions.model";

export async function GET() {
  try {
    const transactions = await getSignedTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json({ status: 500, error: err.message });
  }
}
