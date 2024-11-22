import {
  decimal,
  integer,
  pgTable,
  text,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { product } from "./product-schema";

export const marketingCampaign = pgTable("marketing_campaign", {
  id: serial("campaign_id").primaryKey(),
  productId: serial("product_id").references(() => product.id),
  campaignName: text("campaign_name").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  description: text("description"),
});

export const salesData = pgTable("sales_data", {
  id: serial("sales_id").primaryKey(),
  productId: serial("product_id").references(() => product.id),
  saleDate: date("sale_date"),
  unitsSold: integer("units_sold"),
  revenue: decimal("revenue", { precision: 10, scale: 2 }),
});
