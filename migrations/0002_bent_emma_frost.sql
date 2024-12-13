ALTER TABLE "project" DROP CONSTRAINT "project_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "projectId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_projectId_project_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "product_id";