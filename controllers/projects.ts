"use server";

import { db } from "@/db";
import { project, task } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProjectWithDetails = {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  product: {
    id: number;
    name: string;
    category: string;
  };
  tasks: {
    id: number;
    title: string;
    description: string | null;
    deadline: Date | null;
    status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
    assignee?: {
      id: number;
      name: string;
      email: string;
    };
  }[];
};

// Project Management
export async function getProjects() {
  const projects = await db.query.project.findMany({
    with: {
      product: true,
      tasks: {
        with: {
          assignee: true,
        },
      },
    },
  });
  return projects;
}

export async function getProject(id: number) {
  const result = await db.query.project.findFirst({
    where: eq(project.id, id),
    with: {
      product: true,
      tasks: {
        with: {
          assignee: true,
        },
      },
    },
  });
  return result;
}

export async function createProject(data: {
  productId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status?: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
}) {
  const result = await db.insert(project).values(data).returning();
  revalidatePath("/dashboard/projects");
  return result[0];
}

export async function updateProject(
  id: number,
  data: {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status?: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  }
) {
  const result = await db
    .update(project)
    .set(data)
    .where(eq(project.id, id))
    .returning();
  revalidatePath("/dashboard/projects");
  return result[0];
}

export async function deleteProject(id: number) {
  await db.delete(project).where(eq(project.id, id));
  revalidatePath("/dashboard/projects");
}

// Task Management
export async function getTasks(projectId?: number) {
  const tasks = await db.query.task.findMany({
    where: projectId ? eq(task.projectId, projectId) : undefined,
    with: {
      project: true,
      assignee: true,
    },
  });
  return tasks;
}

export async function getTask(id: number) {
  const result = await db.query.task.findFirst({
    where: eq(task.id, id),
    with: {
      project: true,
      assignee: true,
    },
  });
  return result;
}

export async function createTask(data: {
  projectId: number;
  title: string;
  description?: string;
  deadline?: Date;
  assignedTo?: string;
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
}) {
  const result = await db.insert(task).values(data).returning();
  revalidatePath("/dashboard/projects");
  return result[0];
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    deadline?: Date;
    assignedTo?: string;
    status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  }
) {
  const result = await db
    .update(task)
    .set(data)
    .where(eq(task.id, id))
    .returning();
  revalidatePath("/dashboard/projects");
  return result[0];
}

export async function deleteTask(id: number) {
  await db.delete(task).where(eq(task.id, id));
  revalidatePath("/dashboard/projects");
}

// Project Analytics
export async function getProjectProgress(id: number) {
  const projectData = await getProject(id);
  if (!projectData) return null;

  const totalTasks = projectData.tasks.length;
  const completedTasks = projectData.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return {
    totalTasks,
    completedTasks,
    progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
  };
}

export async function getProjectTimeline(id: number) {
  const projectData = await getProject(id);
  if (!projectData) return null;

  const timeline = {
    start: projectData.startDate,
    end: projectData.endDate,
    milestones: projectData.tasks
      .filter((task) => task.deadline)
      .map((task) => ({
        title: task.title,
        date: task.deadline!,
        status: task.status,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  };

  return timeline;
}
