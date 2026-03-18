ALTER TABLE "users" ADD COLUMN "is-verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification-code" varchar(10);