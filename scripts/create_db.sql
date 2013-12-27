drop table users;
drop table projects;
CREATE TABLE users (
    id serial primary key,
    name varchar(255),
    password varchar(255),
    projects int[]
);
CREATE TABLE projects (
    id serial primary key,
    name varchar(255),
    top_level_object int,
    users int[]
);
CREATE TABLE permissions (
    id serial primary key,
    user int,
    project int,
    read boolean,
    write boolean,
    admin boolean
);
