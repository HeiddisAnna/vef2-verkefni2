CREATE TABLE applications (
  id serial primary key,
  name varchar(64) not null,
  email varchar(64) not null,
  phone int, 
  text text, 
  job varchar(64), 
  processed: boolean default false,
  Created timestamp with time zone not null default current_timestamp,
  Updated timestamp with time zone not null default current_timestamp
);
