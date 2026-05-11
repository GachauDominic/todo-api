ALTER TABLE "users" ADD COLUMN "first_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first-name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last-name";