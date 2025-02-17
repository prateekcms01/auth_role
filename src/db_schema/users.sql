CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roles text,
    phone VARCHAR(20) NOT NULL, -- if you're storing phone numbers
    otp VARCHAR(6),
    otpExpires BIGINT;
);