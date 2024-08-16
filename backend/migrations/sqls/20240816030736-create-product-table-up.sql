/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS foods(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL NOT NULL,
);