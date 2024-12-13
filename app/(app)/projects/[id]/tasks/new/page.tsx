import { TaskForm } from "@/app/(app)/projects/_components/task-form";
import { getUsers } from "@/controllers/auth";

interface Props {
  params: {
    id: string;
  };
}

export default async function NewTaskPage({ params }: Props) {
  const users = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">New Task</h1>
      <TaskForm projectId={parseInt(params.id)} users={users} />
    </div>
  );
}
