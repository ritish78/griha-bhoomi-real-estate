DO $$ BEGIN
 CREATE TYPE "house_type" AS ENUM('House', 'Flat', 'Shared', 'Room', 'Apartment', 'Bungalow', 'Villa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "land_type" AS ENUM('plotting', 'residential', 'agricultural', 'industrial');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_status" AS ENUM('Sale', 'Rent', 'Hold', 'Sold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "property_type" AS ENUM('House', 'Mansion', 'Flat', 'Apartment', 'Land', 'Villa', 'Building');
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
CREATE TABLE IF NOT EXISTS "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"house_number" varchar(125),
	"street" varchar(255),
	"ward_number" smallint NOT NULL,
	"municipality" varchar(125),
	"city" varchar(125) NOT NULL,
	"province" varchar(125) NOT NULL,
	"latitude" real,
	"longitude" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "house" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"house_type" "house_type" NOT NULL,
	"room_count" smallint NOT NULL,
	"floor_count" smallint DEFAULT 1 NOT NULL,
	"kitchen_count" smallint NOT NULL,
	"shared_bathroom" boolean DEFAULT false NOT NULL,
	"bathroom_count" smallint NOT NULL,
	"facilities" text,
	"area" varchar(125),
	"furnished" boolean DEFAULT false NOT NULL,
	"facing" varchar(125),
	"car_parking" smallint,
	"bike_parking" smallint,
	"ev_charging" boolean DEFAULT false,
	"built_at" timestamp,
	"connected_to_road" boolean NOT NULL,
	"distance_to_road" boolean NOT NULL,
	"listed_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "land" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"land_type" "land_type" DEFAULT 'residential',
	"area" varchar(125),
	"connected_to_road" boolean NOT NULL,
	"distance_to_road" boolean NOT NULL,
	"listed_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
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
	"property_type" "property_type" DEFAULT 'Flat' NOT NULL,
	"available_from" timestamp NOT NULL,
	"available_till" timestamp,
	"price" integer NOT NULL,
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
CREATE INDEX IF NOT EXISTS "municipality_index" ON "address" ("municipality");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "city_index" ON "address" ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "province_index" ON "address" ("province");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "house_type_index" ON "house" ("house_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "room_count_index" ON "house" ("room_count");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "land_type_index" ON "land" ("land_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "area_index" ON "land" ("area");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "connected_to_road_index" ON "land" ("connected_to_road");--> statement-breakpoint
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
 ALTER TABLE "address" ADD CONSTRAINT "address_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "house" ADD CONSTRAINT "house_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "land" ADD CONSTRAINT "land_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property" ADD CONSTRAINT "property_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
