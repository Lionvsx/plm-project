CREATE TYPE "public"."supplier_order_status" AS ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_order" (
	"id" integer PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"status" "supplier_order_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier_order_ingredient" (
	"id" integer PRIMARY KEY NOT NULL,
	"supplier_order_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit" varchar(10) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
