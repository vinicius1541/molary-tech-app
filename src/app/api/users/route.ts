import { NextResponse } from "next/server";
import { getUsers } from "@/server/usuario/actions";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Não foi possível carregar os usuários." }, { status: 500 });
  }
}
