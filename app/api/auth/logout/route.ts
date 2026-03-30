import { revokeSession } from "@/app/lib/auth/session";

export async function POST() {
  return await revokeSession();
}
