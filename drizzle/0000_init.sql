CREATE TABLE "neon_bucks" (
	"user_id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_completed_checkout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_customers" (
	"user_id" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stripe_completed_checkout_sessions" ADD CONSTRAINT "stripe_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_customers" ADD CONSTRAINT "stripe_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stripe_completed_checkout_sessions_user_id_idx" ON "stripe_completed_checkout_sessions" USING btree ("user_id");