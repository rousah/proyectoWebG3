drop table if exists usuarios;

CREATE TABLE usuarios (
    lastname varchar(255),
    firstname varchar(255),
    email varchar(255),
    username varchar(255),
    password varchar(255) 
);


insert into usuarios values ('Glockow', 'Luca', 'luca@cultisense.es', 'luca', '123456');
insert into usuarios values ('van der Heide', 'Rosa', 'rosa@cultisense.es','rosa', '123456');
insert into usuarios values ('Santi', 'Perez', 'santi@cultisense.es','santi', '123456');
insert into usuarios values ('Martinez', 'Héctor', 'hector@cultisense.es','hector', '123456');
insert into usuarios values ('Sanz', 'Román', 'roman@cultisense.es','roman', '123456');