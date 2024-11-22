CREATE TABLE IF NOT EXISTS "formula_variant" (
	"formula_variant_id" serial PRIMARY KEY NOT NULL,
	"formula_id" integer,
	"name" text NOT NULL,
	"version" integer,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "formula_ingredient" RENAME COLUMN "formula_id" TO "formula_variant_id";--> statement-breakpoint
ALTER TABLE "formula" DROP CONSTRAINT "formula_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "formula_ingredient" DROP CONSTRAINT "formula_ingredient_formula_id_formula_formula_id_fk";
--> statement-breakpoint
ALTER TABLE "formula" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "formula" ADD COLUMN "description" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formula_variant" ADD CONSTRAINT "formula_variant_formula_id_formula_formula_id_fk" FOREIGN KEY ("formula_id") REFERENCES "public"."formula"("formula_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formula_ingredient" ADD CONSTRAINT "formula_ingredient_formula_variant_id_formula_variant_formula_variant_id_fk" FOREIGN KEY ("formula_variant_id") REFERENCES "public"."formula_variant"("formula_variant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "formula" DROP COLUMN IF EXISTS "product_id";--> statement-breakpoint
ALTER TABLE "formula" DROP COLUMN IF EXISTS "version";--> statement-breakpoint
ALTER TABLE "formula" DROP COLUMN IF EXISTS "creation_date";