import { getSignedTransactions } from "../../../../models/transactions.model";

export async function GET() {
  try {
    const transactions = await getSignedTransactions();

    return Response.json(transactions, { status: 200 });
  } catch (err) {
    return Response.json(
      {
        error: "Failed get signed transactions",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
