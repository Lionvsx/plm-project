ALTER TABLE "supplier" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "phone" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier" RENAME COLUMN "supplier_id" TO "id";--> statement-breakpoint
ALTER TABLE "supplier" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "supplier" DROP COLUMN IF EXISTS "contact_person";