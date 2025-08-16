-- This script initializes the promotions table.

CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_src VARCHAR(255),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- You can add some initial data for testing if you want
-- INSERT INTO promotions (title, description, image_src) VALUES
-- ('Весь Май скидка 10%', 'На все работы по системе охлаждения', '/images/sale.svg');
