import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum([
    "PLANNING",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});
