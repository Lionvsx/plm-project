ALTER TABLE "public"."project" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."project_status" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "public"."project" ALTER COLUMN "status" SET DATA TYPE "public"."project_status" USING "status"::"public"."project_status";