import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  return <Dashboard />;
}