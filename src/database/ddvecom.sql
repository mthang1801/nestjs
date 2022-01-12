create database if not exists ddvecom;

use ddvecom;
create table user(
	id int(12) auto_increment primary key, 
    displayName varchar(50) not null, 
    email varchar(260) unique not null, 
    password varchar(260) not null, 
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

create table categories(
	categoryID int(12) auto_increment primary key, 
    categoryName varchar(50)
);
	
create table products(
	productID int(12) auto_increment primary key,
    productName varchar(100) not null, 
    productPrice float not null check(productPrice > 0), 
    productWeight float check(productWeight > 0), 
    productCartDesc varchar(250) , 
    productShortDesc varchar(1000), 
    productLongDesc text, 
    productThumb varchar(100), 
    productImage varchar(100), 
    productCategoryID int(12), 
    productNumber int check(productNumber > 0),  
    productOrigin varchar(100),
    productCreatedAt timestamp default current_timestamp(),
    productUpdatedAt timestamp default current_timestamp()
);

ALTER TABLE products ADD FOREIGN KEY (productCategoryID) references categories(categoryID);




