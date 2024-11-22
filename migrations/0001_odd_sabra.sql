CREATE TABLE IF NOT EXISTS "formula" (
	"formula_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"version" integer,
	"creation_date" date,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formula_ingredient" (
	"formula_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"percentage" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ingredient" (
	"ingredient_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"supplier_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"launch_date" date,
	"discontinuation_date" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variant" (
	"variant_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"size" text,
	"sku" text,
	"price" numeric(10, 2),
	CONSTRAINT "product_variant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"inventory_id" serial PRIMARY KEY NOT NULL,
	"product_id" serial NOT NULL,
	"variant_id" serial NOT NULL,
	"quantity" integer,
	"last_updated" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_info" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "manufacturing_batch" (
	"batch_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"formula_id" integer,
	"production_date" date,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quality_test" (
	"test_id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer,
	"test_date" date,
	"result" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "marketing_campaign" (
	"campaign_id" serial PRIMARY KEY NOT NULL,
	"product_id" serial NOT NULL,
	"campaign_name" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"budget" numeric(10, 2),
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_data" (
	"sales_id" serial PRIMARY KEY NOT NULL,
	"product_id" serial NOT NULL,
	"sale_date" date,
	"units_sold" integer,
	"revenue" numeric(10, 2)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formula" ADD CONSTRAINT "formula_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formula_ingredient" ADD CONSTRAINT "formula_ingredient_formula_id_formula_formula_id_fk" FOREIGN KEY ("formula_id") REFERENCES "public"."formula"("formula_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formula_ingredient" ADD CONSTRAINT "formula_ingredient_ingredient_id_ingredient_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("ingredient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_supplier_id_supplier_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variant_id_product_variant_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("variant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manufacturing_batch" ADD CONSTRAINT "manufacturing_batch_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manufacturing_batch" ADD CONSTRAINT "manufacturing_batch_formula_id_formula_formula_id_fk" FOREIGN KEY ("formula_id") REFERENCES "public"."formula"("formula_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quality_test" ADD CONSTRAINT "quality_test_batch_id_manufacturing_batch_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."manufacturing_batch"("batch_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marketing_campaign" ADD CONSTRAINT "marketing_campaign_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_data" ADD CONSTRAINT "sales_data_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
