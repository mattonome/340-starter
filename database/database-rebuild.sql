-- database-rebuild.sql
-- Destroys and rebuilds the database structure and data
-- Drop tables if they already exist (order matters because of foreign keys)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
-- Drop type if it already exists
DROP TYPE IF EXISTS account_type_enum;
-- 1. Create ENUM type for account_type
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin', 'Employee');
-- 2. Create tables
-- Account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_type account_type_enum DEFAULT 'Client'
);
-- Classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE NOT NULL
);
-- Inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INT NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    inv_price NUMERIC(10, 2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT NOT NULL REFERENCES classification(classification_id)
);
-- 3. Insert sample data into classification
INSERT INTO classification (classification_name)
VALUES ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan'),
    ('Coupe');
-- 4. Insert sample data into inventory
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'GM',
        'Hummer',
        2021,
        'Big body with small interiors',
        '/images/hummer.jpg',
        '/images/hummer-thumb.jpg',
        55000.00,
        12000,
        'Black',
        2
    ),
    (
        'Ford',
        'Mustang',
        2020,
        'Classic sports car',
        '/images/mustang.jpg',
        '/images/mustang-thumb.jpg',
        45000.00,
        8000,
        'Red',
        1
    );
-- 5. Copies of Task One queries (4 and 6) at the very bottom
-- Query 4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Query 6: Update all inventory images to include '/vehicles'
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');