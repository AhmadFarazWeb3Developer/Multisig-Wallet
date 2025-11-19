import { getTransactions } from "../../../models/transactionHashs";

export async function GET() {
  try {
    const transactions = await getTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json({ status: 500, error: err.message });
  }
}
