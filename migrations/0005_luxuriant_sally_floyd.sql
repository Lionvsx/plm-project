ALTER TABLE "ingredient" ADD COLUMN "unit_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "cost_price";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "margin";