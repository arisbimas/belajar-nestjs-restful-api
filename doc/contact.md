# Contact API Spec

## Create Contact
Endpoint: POST /api/contacts

Header:
```
Authorization: <token>
```

Request Body:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "[EMAIL_ADDRESS]",
    "phone": "123456789"
}
```

Response Body (Success):
```json
{
    "data": {
        "id":1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "[EMAIL_ADDRESS]",
        "phone": "123456789"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact already exists"
}
```

## Get Contact
Endpoint: GET /api/contacts/:contactId

Header:
```
Authorization: <token>
```

Response Body (Success):
```json
{
    "data": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "[EMAIL_ADDRESS]",
        "phone": "123456789"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## Update Contact
Endpoint: PUT /api/contacts/:contactId

Header:
```
Authorization: <token>
```

Request Body:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "[EMAIL_ADDRESS]",
    "phone": "123456789"
}
```

Response Body (Success):
```json
{
    "data": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "[EMAIL_ADDRESS]",
        "phone": "123456789"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```

## Remove Contact
Endpoint: DELETE /api/contacts/:contactId

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

## Search Contact
Endpoint: GET /api/contacts

Header:
```
Authorization: <token>
```

Query Params:
```
name: string, contact first_name or last_name, optional
email: string, contact email, optional
phone: string, contact phone, optional
page: number, default 1, optional
size: number, default 10, optional
```

Response Body (Success):
```json
{
    "data": [
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "[EMAIL_ADDRESS]",
            "phone": "123456789"
        }
    ],
    "paging": {
        "current_page": 1,
        "total_page": 1,
        "size": 10,
    }
}
```

Response Body (Error):
```json
{
    "errors": "Contact not found"
}
```