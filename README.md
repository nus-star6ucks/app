# VMCS

## Setup

1. node.js (v12 ~ v16 should work)
  For macOS, consider using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to install (LTS version), for Windows, just go to the official website and download it directly.
2. `git clone` the project locally, then `npm install`
3. Run `VmcsApplication.java` on `api/src/main/.../vmcs` through IntelliJ IDEA or VSCode, Spring Boot will take the local port `8081`.
4. Enter `npm run dev` in the project root directory and electron will take the local port `3344`.

## Config

Example import file (save the following as any `.json` file).

```json
{
    "users": [
        {
            "id": 1,
            "role": "Maintainer",
            "password": "123891",
            "status": "logout"
        }
    ],
    "machines": [
        {
            "id": 1,
            "name": "Star6ucks",
            "doorLocked": true
        }
    ],
    "coins": [
        {
            "id": 3,
            "name": "5c",
            "value": 5,
            "quantity": 22,
            "weight": 1
        },
        {
            "id": 4,
            "name": "10c",
            "value": 10,
            "quantity": 37,
            "weight": 1
        },
        {
            "id": 5,
            "name": "20c",
            "value": 20,
            "quantity": 9,
            "weight": 1
        },
        {
            "id": 6,
            "name": "50c",
            "value": 50,
            "quantity": 12,
            "weight": 1
        },
        {
            "id": 7,
            "name": "$1",
            "value": 100,
            "quantity": 10,
            "weight": 1
        }
    ],
    "drinks": [
        {
            "id": 1,
            "name": "Coca-Cola",
            "quantity": 4,
            "price": 75,
            "slotNum": 1
        },
        {
            "id": 2,
            "name": "Fanta",
            "quantity": 7,
            "price": 85,
            "slotNum": 2
        },
        {
            "id": 3,
            "name": "Sarsi",
            "quantity": 12,
            "price": 70,
            "slotNum": 3
        },
        {
            "id": 4,
            "name": "Soya Bean",
            "quantity": 0,
            "price": 60,
            "slotNum": 4
        },
        {
            "id": 5,
            "name": "Coca-Cola",
            "quantity": 1,
            "price": 75,
            "slotNum": 5
        }
    ]
}
```


## Note

1. The core front-end code is under `packages/renderer/src` (the rest is not of concern), and `openapi` is Apifox-generated code, which is also not of concern.
2. the core back-end code is under `api/`

