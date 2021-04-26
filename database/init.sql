BEGIN;

DROP TABLE IF EXISTS fac_members, comments, commenter CASCADE;

CREATE TABLE fac_members (
  id serial primary key,
  firstname varchar(255) NOT NULL
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text_content TEXT
);

CREATE TABLE commenter (
  id SERIAL PRIMARY KEY,
  text_content TEXT,
);

INSERT INTO fac_members (firstname) VALUES
  ('Jim'),
  ('Sal'),
  ('Ko')
;

INSERT INTO comments (text_content) VALUES
  ('Oh em gee'),
  ('Happy days')
;

-- INSERT INTO commenter (text_content, commenter_id) VALUES
--   ('Anonymous', 1),
--   ('Anonymous', 2)
-- ;

COMMIT;

