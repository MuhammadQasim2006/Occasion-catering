CREATE DATABASE occasion_catering;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    CONSTRAINT fk_customers_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 4. Catering Packages Table
CREATE TABLE catering_packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    event_size ENUM('large', 'small', 'tour') NOT NULL,
    image_url VARCHAR(255),
    CONSTRAINT fk_catering_categories FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

-- 5. Menu Items Table
CREATE TABLE menu_items (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price_addon DECIMAL(10, 2) DEFAULT 0.00,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_menu_items_packages FOREIGN KEY (package_id) REFERENCES catering_packages(package_id) ON DELETE CASCADE
);

-- 6. Tour Operators Table
CREATE TABLE tour_operators (
    operator_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20)
);

-- 7. Tour Packages Table
CREATE TABLE tour_packages (
    tour_package_id INT AUTO_INCREMENT PRIMARY KEY,
    operator_id INT NOT NULL,
    package_id INT NOT NULL,
    itinerary_notes TEXT,
    CONSTRAINT fk_tour_packages_operator FOREIGN KEY (operator_id) REFERENCES tour_operators(operator_id) ON DELETE CASCADE,
    CONSTRAINT fk_tour_packages_catering FOREIGN KEY (package_id) REFERENCES catering_packages(package_id) ON DELETE CASCADE
);

-- 8. Bookings Table
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    event_date DATETIME NOT NULL,
    guest_count INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 9. Booking Items Table
CREATE TABLE booking_items (
    booking_item_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    package_id INT NOT NULL,
    menu_item_id INT NULL,
    quantity INT NOT NULL DEFAULT 1,
    line_total DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_booking_items_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_items_package FOREIGN KEY (package_id) REFERENCES catering_packages(package_id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_items_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE SET NULL
);

-- 10. Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL DEFAULT 'payfast',
    gateway_payment_id VARCHAR(100),
    merchant_payment_id VARCHAR(100),
    status ENUM('pending', 'complete', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    itn_verified BOOLEAN DEFAULT FALSE,
    raw_itn_payload TEXT,
    paid_at DATETIME NULL,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);