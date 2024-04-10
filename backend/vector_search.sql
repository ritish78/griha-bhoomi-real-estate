ALTER TABLE property ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description || ' ' || close_landmark || ' ' || address)) STORED;
UPDATE property SET search_vector = to_tsvector('english', title || ' ' || description);
CREATE INDEX property_vector_search_index ON property USING gin(search_vector);
SELECT id, title, ts_rank(search_vector, to_tsquery('english', 'dynamic search terms')) as rank FROM property WHERE search_vector @@ to_tsquery('english', 'dynamic search terms') ORDER BY rank desc;