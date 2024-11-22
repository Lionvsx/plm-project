import { AppHeader } from "@/components/app-header";

export default function Page() {
  return (
    <div>
      <AppHeader items={[{ label: "Dashboard", href: "/dashboard" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1>Heyy</h1>
      </div>
    </div>
  )
}
