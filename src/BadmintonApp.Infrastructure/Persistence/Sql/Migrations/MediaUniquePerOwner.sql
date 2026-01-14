-- 1 logo / cover / avatar per owner
CREATE UNIQUE INDEX IF NOT EXISTS ux_media_single_per_owner
ON "Media" ("OwnerType","OwnerId","Kind")
WHERE "Kind" IN (1,2,4);

-- gallery lookup
CREATE INDEX IF NOT EXISTS ix_media_gallery_lookup
ON "Media" ("OwnerType","OwnerId","Kind","SortOrder","CreatedAt");