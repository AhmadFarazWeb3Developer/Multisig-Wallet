import { NextResponse } from "next/server";

export async function GET() {
  // Normally you'd fetch from DB or controller here
  const users = [
    { id: 1, name: "Ahmad", email: "ahmad@example.com" },
    { id: 2, name: "Ali", email: "ali@example.com" },
    { id: 3, name: "Sara", email: "sara@example.com" },
  ];

  return NextResponse.json(users);
}
