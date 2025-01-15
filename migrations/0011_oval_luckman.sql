ALTER TABLE "public"."user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'product_manager', 'formulation_scientist', 'procurement', 'project_manager', 'sales_representative', 'viewer');--> statement-breakpoint
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";