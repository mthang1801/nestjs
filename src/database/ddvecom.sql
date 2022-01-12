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
	id int(12) auto_increment primary key, 
    categoryName varchar(50) unique
);


create table products(
	id int(12) auto_increment primary key, 
    productName varchar(100) not null, -- Title cho sản phẩm    	
    productShortDesc varchar(512), -- Mô tả ngắn gọn thông tin sản Phẩm, phục vụ cho SEO 
    productLongDesc text,  -- Mô tả chi tiết thông tin sản phẩm        
    productThumb varchar(100), -- Thumbnail cho sản phẩm        
    productCategoryID int(12),  -- FK Liên kết đến category
    productOrigin varchar(100), -- Nguồn gốc, xuất xứ của SP
	productQuarranty varchar(20),
    productCreatedAt timestamp default current_timestamp(),
    productUpdatedAt timestamp default current_timestamp()
);	

ALTER TABLE products ADD CONSTRAINT fk_products_categories FOREIGN KEY (productCategoryID) references categories(id);
ALTER TABLE products ADD CONSTRAINT chk_min_max_price CHECK (productMinPrice <= productMaxPrice);






