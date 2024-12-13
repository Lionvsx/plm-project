ALTER TABLE "formulation" RENAME COLUMN "product_id" TO "product_variant_id";--> statement-breakpoint
ALTER TABLE "formulation" DROP CONSTRAINT "formulation_product_id_product_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formulation" ADD CONSTRAINT "formulation_product_variant_id_product_variant_variant_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variant"("variant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
