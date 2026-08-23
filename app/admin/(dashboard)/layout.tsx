import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
