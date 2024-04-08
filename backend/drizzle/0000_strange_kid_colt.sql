DO $$ BEGIN
 CREATE TYPE "property_status" AS ENUM('Sale', 'Hold', 'Sold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_type" AS ENUM('House', 'Flat', 'Apartment', 'Land', 'Building');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('ADMIN', 'MODERATOR', 'VIEWER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"to_rent" boolean NOT NULL,
	"address" varchar(255),
	"close_landmark" varchar(255),
	"property_type" "property_type" NOT NULL,
	"available_from" timestamp NOT NULL,
	"available_till" timestamp,
	"price" varchar(12),
	"negotiable" boolean DEFAULT false NOT NULL,
	"image_url" text[],
	"status" "property_status" DEFAULT 'Sale' NOT NULL,
	"listed_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"featured" boolean DEFAULT false,
	"expires_on" timestamp,
	"views" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"phone" varchar(10),
	"dob" varchar(10) NOT NULL,
	"bio" text,
	"profile_pic_url" text,
	"second_email" varchar(255),
	"enabled" boolean DEFAULT true NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_agent" boolean DEFAULT false NOT NULL,
	"role" "user_role" DEFAULT 'VIEWER' NOT NULL,
	"last_active" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_id_index" ON "property" ("seller_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "landmark_index" ON "property" ("close_landmark");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_index" ON "property" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "availbe_from_index" ON "property" ("available_from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "featured_index" ON "property" ("featured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_index" ON "property" ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_index" ON "property" ("price");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_type_index" ON "property" ("property_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_index" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property" ADD CONSTRAINT "property_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
