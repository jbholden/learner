drop table topics;
drop table top_levels;
drop table images;
CREATE TABLE top_levels (
    id serial primary key,
    name varchar(255),
    type varchar(255),
    topics int[],
    understood float
);
CREATE TABLE topics (
    id serial primary key,
    title varchar(255),
    content_type varchar(255),
    description text,
    understood float,
    reviews bigint[],
    toplevel int,
    parent_topic int,
    sub_topics int[],
    images int[]
);
CREATE TABLE images (
    id serial primary key,
    data bytea
);
