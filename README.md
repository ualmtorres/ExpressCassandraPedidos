# API REST para gestión historial de pedidos y seguimiento en tiempo real con Express y Cassandra

Este proyecto es un despliegue de una API REST para gestionar el historial de pedidos y seguimiento en tiempo real de los mismos en un sistema de comercio electrónico. La API REST permite la creación de pedidos y permite a los usuarios consultar su historial de pedidos y a los administradores monitorizar pedidos en tiempo real. La API REST está desarrollada con Express y se despliega con Docker.

## Instalación

Basta con clonar el repositorio y ejecutar los siguientes comandos:

```bash
docker-compose up -d
npm install
npm run start
```

## Acceso a la API REST

La API REST se despliega en `http://localhost:3000`. A continuación se describen los endpoints disponibles:

### Endpoints

- `POST /orders`: Crea un nuevo pedido.
- `GET /orders`: Obtener todos los pedidos o los pedidos de un usuario específico.
  - Parámetros opcionales:
    - `user_id`: Filtra los pedidos por el ID del usuario y los devuelve en orden cronológico inverso.
    - `status`: Filtra los pedidos por el estado y los devuelve en orden cronológico inverso.
- `GET /orders/:order_id`: Obtener los detalles de un pedido específico y sus productos.
- `PUT /orders/:order_id`: Actualizar el estado de un pedido.

### Ejemplo de JSON de un pedido

```json
{
   "order_id": "123e4567-e89b-12d3-a456-426614174000",
   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   "order_date": "2023-10-10T10:00:00Z",
   "status": "pending",
   "total": 100.0,
   "items": [
      {
         "product_id": "product1",
         "quantity": 2,
         "price": 10.0
      },
      {
         "product_id": "product2",
         "quantity": 1,
         "price": 20.0
      }
   ]
}
```

### Ejemplo de JSON del estado de un pedido

```json
{
   "status": "delivered"
}
```