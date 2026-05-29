ALTER TABLE "bot_data" RENAME COLUMN "json_content" TO "items";--> statement-breakpoint
ALTER TABLE "bot_data" DROP CONSTRAINT "bot_data_name_unique";--> statement-breakpoint
ALTER TABLE "bot_data" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "bot_data" ALTER COLUMN "id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "bot_data" ALTER COLUMN "uploaded_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bot_data" ADD COLUMN "weapons" jsonb;--> statement-breakpoint
ALTER TABLE "bot_data" ADD COLUMN "magics" jsonb;--> statement-breakpoint
ALTER TABLE "bot_data" DROP COLUMN "name";