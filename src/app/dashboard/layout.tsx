import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar userName={session.name} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
