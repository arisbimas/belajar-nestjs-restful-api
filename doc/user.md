# User API Spec

## Register User
Endpoint: POST /api/users

Request Body:
```json
{
    "username": "john_doe",
    "password": "[PASSWORD]",
    "name": "John Doe"
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "john_doe",
        "name": "John Doe"
    },
}
```

Response Body (Error):
```json
{
    "errors": "User already registered"
}
```

## Login User
Endpoint: POST /api/users/login

Request Body:
```json
{
    "username": "john_doe",
    "password": "[PASSWORD]"
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "john_doe",
        "name": "John Doe",
        "token": "session_id_generated"
    },
}
```

Response Body (Error):
```json
{
    "errors": "User not found"
}
```

## Get User
Endpoint: GET /api/users/current

Header:
```
Authorization: <token>
```

Response Body (Success):
```json
{
    "data": {
        "username": "john_doe",
        "name": "John Doe"
    },
}
```

Response Body (Error):
```json
{
    "errors": "Unauthorized"
}
```

## Update User
Endpoint: PATCH /api/users/current

Header:
```
Authorization: <token>
```

Request Body:
```json
{
    "name": "John Doe", // optional
    "password": "[PASSWORD]" // optional
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "john_doe",
        "name": "John Doe"
    },
}
```

Response Body (Error):
```json
{
    "errors": "User not found"
}
```

## Logout User
Endpoint: DELETE /api/users/current

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