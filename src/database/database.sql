
create table users(
  id int auto_increment primary key, 
  googleId varchar(50), 
  facebookId varchar(50),
  email varchar(260) unique not null, 
  password varchar(260) not null, 
  displayName varchar(50) not null, 
  firstName varchar(50), 
  lastName varchar(50),
  avatar varchar(256),
  phone varchar(20) not null,
  country varchar(50) ,
  city varchar(50), 
  district varchar(50), 
  address varchar(100), 
  verifyToken varchar(260),
  verifyTokenExpAt timestamp, 
  createdAt timestamp default current_timestamp(), 
  updatedAt timestamp default current_timestamp()
);