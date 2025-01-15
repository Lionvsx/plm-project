import { getUsers } from "@/controllers/auth";
import { UserTable } from "./_components/user-table";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users Management</h1>
      </div>
      <UserTable users={users} />
    </div>
  );
}
