ALTER TABLE "game" ALTER COLUMN "start_time" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "game" DROP COLUMN IF EXISTS "end_time";