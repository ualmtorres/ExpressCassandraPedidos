var express = require('express');
var router = express.Router();

const client = require('../db/cassandra');

// Endpoint GET "/orders" para obtener todos los pedidos de un usuario 
// o todos los pedidos si no se especifica un usuario
// También se puede filtrar por estado de pedido
router.get('/', async (req, res) => {
    const { user_id } = req.query;
    const { status } = req.query;

    if (status) {
        try {
            const result = await client.execute('SELECT * FROM orders_by_status WHERE status = ?', [status], { prepare: true });
            res.status(200).send(result.rows);
        } catch (error) {
            res.status(500).send({ error: 'Failed to fetch orders by status' });
        }
        return
    }

    if (user_id) {
        try {
            const result = await client.execute('SELECT * FROM orders_by_user WHERE user_id = ?', [user_id], { prepare: true });
            res.status(200).send(result.rows);
        } catch (error) {
            res.status(500).send({ error: 'Failed to fetch orders for user' });
        }
        return
    }

    try {
        const result = await client.execute('SELECT * FROM orders', [], { prepare: true });
        res.status(200).send(result.rows);
    }
    catch (error) {
        res.status(500).send({ error: 'Failed to fetch orders' });
    }
});

// Endpoint GET "/orders/:id" para obtener los detalles de un pedido y sus productos
router.get('/:order_id', async (req, res) => {
    const { order_id } = req.params;


    try {
        const orderResult = await client.execute('SELECT * FROM orders WHERE order_id = ?', [order_id], { prepare: true });

        if (orderResult.rowLength === 0) {
            return res.status(404).send({ error: 'Order not found' });
        }

        res.status(200).send(orderResult.rows[0]);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch order details' });
    }
});

// Endpoint PUT "/orders/:id" para actualizar el estado de un pedido
router.put('/:order_id', async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    try {
        const orderResult = await client.execute('SELECT * FROM orders WHERE order_id = ?', [order_id], { prepare: true });

        if (orderResult.rowLength === 0) {
            return res.status(404).send({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        const queries = [
            {
                query: 'UPDATE orders SET status = ? WHERE order_id = ?',
                params: [status, order_id]
            },
            {
                query: 'UPDATE orders_by_user SET status = ? WHERE user_id = ? AND order_date = ? AND order_id = ?',
                params: [status, order.user_id, order.order_date, order_id]
            },
            {
                query: 'INSERT INTO orders_by_status (status, order_date, order_id, user_id, total) VALUES (?, ?, ?, ?, ?)',
                params: [status, order.order_date, order_id, order.user_id, order.total]
            },
            {
                query: 'DELETE FROM orders_by_status WHERE status = ? AND order_date = ? AND order_id = ?',
                params: [order.status, order.order_date, order.order_id]
            }
        ];

        await client.batch(queries, { prepare: true });
        res.status(200).send({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update order' });
    }
});

// Endpoint POST "/orders" para crear un nuevo pedido
router.post('/', async (req, res) => {
    const { order_id, user_id, order_date, status, total, items } = req.body;

    // Transformar items en una lista de mapas congelados
    const transformedItems = items.map(item => ({
        [item.product_id]: item.quantity
    }));

    const queries = [
        {
            query: 'INSERT INTO orders (order_id, user_id, order_date, status, total, items) VALUES (?, ?, ?, ?, ?, ?)',
            params: [order_id, user_id, order_date, status, total, transformedItems]
        },
        {
            query: 'INSERT INTO orders_by_user (user_id, order_date, order_id, status, total) VALUES (?, ?, ?, ?, ?)',
            params: [user_id, order_date, order_id, status, total]
        },
        {
            query: 'INSERT INTO orders_by_status (status, order_date, order_id, user_id, total) VALUES (?, ?, ?, ?, ?)',
            params: [status, order_date, order_id, user_id, total]
        }
    ];

    try {
        await client.batch(queries, { prepare: true });
        res.status(201).send({ message: 'Order created successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;

// Example JSON bodies for POST /"orders
// [
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174001",
//         "user_id": "550e8400-e29b-41d4-a716-446655440001",
//         "order_date": "2023-10-11T10:00:00Z",
//         "status": "pending",
//         "total": 150.0,
//         "items": [
//             { "product_id": "product1", "quantity": 3, "price": 10.0 },
//             { "product_id": "product3", "quantity": 2, "price": 30.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174002",
//         "user_id": "550e8400-e29b-41d4-a716-446655440001",
//         "order_date": "2023-10-12T11:00:00Z",
//         "status": "shipped",
//         "total": 200.0,
//         "items": [
//             { "product_id": "product2", "quantity": 4, "price": 20.0 },
//             { "product_id": "product4", "quantity": 1, "price": 100.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174003",
//         "user_id": "550e8400-e29b-41d4-a716-446655440002",
//         "order_date": "2023-10-13T12:00:00Z",
//         "status": "delivered",
//         "total": 75.0,
//         "items": [
//             { "product_id": "product1", "quantity": 1, "price": 10.0 },
//             { "product_id": "product5", "quantity": 5, "price": 13.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174004",
//         "user_id": "550e8400-e29b-41d4-a716-446655440002",
//         "order_date": "2023-10-14T13:00:00Z",
//         "status": "pending",
//         "total": 300.0,
//         "items": [
//             { "product_id": "product3", "quantity": 10, "price": 30.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174005",
//         "user_id": "550e8400-e29b-41d4-a716-446655440002",
//         "order_date": "2023-10-15T14:00:00Z",
//         "status": "canceled",
//         "total": 50.0,
//         "items": [
//             { "product_id": "product2", "quantity": 2, "price": 25.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174006",
//         "user_id": "550e8400-e29b-41d4-a716-446655440003",
//         "order_date": "2023-10-16T15:00:00Z",
//         "status": "pending",
//         "total": 120.0,
//         "items": [
//             { "product_id": "product4", "quantity": 1, "price": 100.0 },
//             { "product_id": "product1", "quantity": 2, "price": 10.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174007",
//         "user_id": "550e8400-e29b-41d4-a716-446655440003",
//         "order_date": "2023-10-17T16:00:00Z",
//         "status": "shipped",
//         "total": 180.0,
//         "items": [
//             { "product_id": "product5", "quantity": 6, "price": 30.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174008",
//         "user_id": "550e8400-e29b-41d4-a716-446655440003",
//         "order_date": "2023-10-18T17:00:00Z",
//         "status": "delivered",
//         "total": 90.0,
//         "items": [
//             { "product_id": "product3", "quantity": 3, "price": 30.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174009",
//         "user_id": "550e8400-e29b-41d4-a716-446655440003",
//         "order_date": "2023-10-19T18:00:00Z",
//         "status": "pending",
//         "total": 60.0,
//         "items": [
//             { "product_id": "product2", "quantity": 3, "price": 20.0 }
//         ]
//     },
//     {
//         "order_id": "123e4567-e89b-12d3-a456-426614174010",
//         "user_id": "550e8400-e29b-41d4-a716-446655440003",
//         "order_date": "2023-10-20T19:00:00Z",
//         "status": "canceled",
//         "total": 110.0,
//         "items": [
//             { "product_id": "product1", "quantity": 5, "price": 10.0 },
//             { "product_id": "product4", "quantity": 1, "price": 60.0 }
//         ]
//     }
// ]

