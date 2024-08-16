/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders(
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    food_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    CONSTRAINT
        FK_customer_id
            FOREIGN KEY(customer_id) REFERENCES customers(id),
    CONSTRAINT
        FK_food_id
            FOREIGN KEY(food_id) REFERENCES foods(id)
);