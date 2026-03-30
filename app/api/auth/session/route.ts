import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken requerido" }, { status: 400 });
    }

    return await createSession(idToken);
  } catch (error) {
    console.error("[auth/session] Error:", error);
    return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 });
  }
}
