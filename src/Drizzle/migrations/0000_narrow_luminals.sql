CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"user-id" integer NOT NULL,
	"todo-name" varchar(100) NOT NULL,
	"created-at" timestamp DEFAULT now(),
	"due-date" timestamp,
	"description" text,
	"is-completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first-name" varchar(50) NOT NULL,
	"last-name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "todo" ADD CONSTRAINT "todo_user-id_users_id_fk" FOREIGN KEY ("user-id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;