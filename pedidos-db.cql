CREATE KEYSPACE IF NOT EXISTS ecommerce
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
};

-- Tabla para almacenar los pedidos. 
-- Se almacena la información de los pedidos y los productos que se compraron.
-- Se utiliza una lista de productos con la cantidad de cada uno.
-- Util para obtener la información de los pedidos y los productos que se compraron.

CREATE TABLE ecommerce.orders (
    order_id UUID PRIMARY KEY,
    user_id UUID,
    order_date TIMESTAMP,
    status TEXT,
    total DECIMAL,
    items LIST<FROZEN<map<TEXT, INT>>>, -- Lista de productos con cantidad { "product_id": cantidad }
);

-- Tabla para almacenar los pedidos por usuario
-- Se almacena la información de los pedidos por usuario.
-- Se utiliza el user_id como clave de partición y el order_date y order_id como claves de clustering.
-- Util para obtener la información de los pedidos de un usuario.

CREATE TABLE ecommerce.orders_by_user (
    user_id UUID,
    order_id UUID,
    order_date TIMESTAMP,
    status TEXT,
    total DECIMAL,
    PRIMARY KEY (user_id, order_date, order_id)
) WITH CLUSTERING ORDER BY (order_date DESC);

-- Tabla para almacenar los pedidos por estado
-- Se almacena la información de los pedidos por estado.
-- Se utiliza el status como clave de partición y el order_date y order_id como claves de clustering.
-- Util para obtener la información de los pedidos por estado.

CREATE TABLE ecommerce.orders_by_status (
    status TEXT,
    order_date TIMESTAMP,
    order_id UUID,
    user_id UUID,
    total DECIMAL,
    PRIMARY KEY (status, order_date, order_id)
) WITH CLUSTERING ORDER BY (order_date DESC);

