import { AuthProvider } from "@/app/auth-provider";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { getServerSession } from "@/controllers/auth";
import { getProducts } from "@/controllers/products";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession()
  const products = await getProducts();

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <AuthProvider session={session}>
      <SidebarProvider>
        <AppSidebar products={products} />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
