CREATE TABLE "public"."todos"("id" bigserial NOT NULL, "text" text NOT NULL, "is_completed" boolean NOT NULL DEFAULT false, "is_public" boolean NOT NULL DEFAULT false, "author_id" bigint NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_todos_updated_at"
BEFORE UPDATE ON "public"."todos"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_todos_updated_at" ON "public"."todos" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
