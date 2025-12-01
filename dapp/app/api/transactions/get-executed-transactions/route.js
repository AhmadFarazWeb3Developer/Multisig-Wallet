import { getExecutedTransactions } from "../../../../models/transactions.model";

export async function GET() {
  try {
    const transactions = await getExecutedTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (err) {
    return Response.json(
      {
        error: "Failed get executed transactions",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
