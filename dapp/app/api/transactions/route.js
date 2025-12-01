import { getTransactions } from "../../../models/transactions.model";

export async function GET() {
  try {
    const transactions = await getTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to get transactions",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
