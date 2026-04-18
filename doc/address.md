## Address API Spec

## Create Address
Endpoint: POST /api/contacts/:contactId/addresses

Header:
```
Authorization: <token>
```

Request Body:
```json
{
    "street": "123 Main St", //optional
    "city": "New York", //optional
    "province": "New York", //optional
    "country": "USA", //required
    "postal_code": "12345" //required
}
```

Response Body (Success):
```json
{
    "data": {
        "id":1,
        "street": "123 Main St",
        "city": "New York",
        "province": "New York",
        "country": "USA",
        "postal_code": "12345"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## Get Address
Endpoint: GET /api/contacts/:contactId/addresses/:addressId

Header:
```
Authorization: <token>
```

Response Body (Success):
```json
{
    "data": {
        "id":1,
        "street": "123 Main St",
        "city": "New York",
        "province": "New York",
        "country": "USA",
        "postal_code": "12345"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## Update Address
Endpoint: PUT /api/contacts/:contactId/addresses/:addressId

Header:
```
Authorization: <token>
```

Request Body:
```json
{
    "id":1,
    "street": "123 Main St",
    "city": "New York",
    "province": "New York",
    "country": "USA",
    "postal_code": "12345"
}
```

Response Body (Success):
```json
{
    "data": {
        "street": "123 Main St",
        "city": "New York",
        "province": "New York",
        "country": "USA",
        "postal_code": "12345"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## Remove Address
Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId

Header:
```
Authorization: <token>
```

Response Body (Success):
```json
{
    "data": true,
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## List Address
Endpoint: GET /api/contacts/:contactId/addresses

Header:
```
Authorization: <token>
```

Response Body (Success):
```json
{
    "data": [
        {
            "id":1,
            "street": "123 Main St",
            "city": "New York",
            "province": "New York",
            "country": "USA",
            "postal_code": "12345"
        }
    ],
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```