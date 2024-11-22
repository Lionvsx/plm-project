import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { getServerSession } from "@/controllers/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
