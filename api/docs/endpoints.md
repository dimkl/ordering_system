# Endpoints

## Discovery

```bash
curl --location --request GET 'http://localhost:3000/discovery'
```

## Customers

### List

```bash
curl --location --request GET 'http://localhost:3000/customers' \
--header 'Content-Type: application/json'
```

### Show

```bash
curl --location --request GET 'http://localhost:3000/customers/13' \
--header 'Content-Type: application/json'
```

### Create

```bash
curl --location --request POST 'http://localhost:3000/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Firstname",
    "last_name": "Lastname",
    "email": "customer+13@example.com",
    "password": "1234"
}'
```

### Update

```bash
curl --location --request PATCH 'http://localhost:3000/customers/13' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Firstname (updated)",
    "last_name": "Lastname (updated)",
}'
```

## Delete

```bash
curl --location --request DELETE 'http://localhost:3000/customers/2' \
--header 'Content-Type: application/json'
```

## Orders

## List

```bash
curl --location --request GET 'http://localhost:3000/orders'
```

## Show

```bash
curl --location --request GET 'http://localhost:3000/orders/1'
```

## Create

```bash
curl --location --request POST 'http://localhost:3000/orders/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "customer_id": 1
}'
```

## Delete

```bash
curl --location --request DELETE 'http://localhost:3000/orders/2' \
--header 'Content-Type: application/json'
```

## Add order item

```bash
curl --location --request POST 'http://localhost:3000/orders/2/order_items' \
--header 'Content-Type: application/json' \
--data-raw '{
    "product_id": 1,
    "quantity": 10
}'
```

## Remove order item

```bash
curl --location --request DELETE 'http://localhost:3000/orders/2/order_items/2' \
--header 'Content-Type: application/json'
```