# GET /api/users

Zwraca paginowaną listę użytkowników. Opcjonalnie można filtrować wyniki według roli.

## Informacje ogólne

| Właściwość | Wartość |
|------------|---------|
| **Metoda** | `GET` |
| **Ścieżka** | `/api/users` |
| **Content-Type (odpowiedź)** | `application/json` |

## Parametry zapytania (query)

| Parametr | Typ | Wymagany | Domyślnie | Opis |
|----------|-----|----------|-----------|------|
| `page` | `integer` | Nie | `1` | Numer strony (liczony od 1). |
| `limit` | `integer` | Nie | `10` | Liczba użytkowników na stronę. Maksymalnie **100**. |
| `role` | `string` | Nie | — | Filtruje użytkowników po roli (np. `admin`, `user`, `moderator`). |

### Walidacja

- `page` — liczba całkowita ≥ 1.
- `limit` — liczba całkowita od 1 do 100 (wartości powyżej 100 są traktowane jako `100` lub zwracany błąd `400` — zależnie od implementacji API).
- `role` — jeśli podany, zwracani są tylko użytkownicy z pasującą rolą.

## Przykładowe żądanie

```http
GET /api/users?page=2&limit=5&role=admin HTTP/1.1
Host: api.example.com
Accept: application/json
```

**cURL:**

```bash
curl -X GET "https://api.example.com/api/users?page=2&limit=5&role=admin" \
  -H "Accept: application/json"
```

## Przykładowa odpowiedź

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": 6,
      "name": "Anna Kowalska",
      "email": "anna@example.com",
      "role": "admin"
    },
    {
      "id": 7,
      "name": "Jan Nowak",
      "email": "jan@example.com",
      "role": "admin"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

### Pola odpowiedzi

| Pole | Typ | Opis |
|------|-----|------|
| `data` | `array` | Lista obiektów użytkownika na bieżącej stronie. |
| `data[].id` | `integer` | Unikalny identyfikator użytkownika. |
| `data[].name` | `string` | Imię i nazwisko. |
| `data[].email` | `string` | Adres e-mail. |
| `data[].role` | `string` | Rola użytkownika. |
| `pagination.page` | `integer` | Aktualna strona. |
| `pagination.limit` | `integer` | Limit wyników na stronę. |
| `pagination.total` | `integer` | Łączna liczba użytkowników (po filtrze `role`, jeśli podany). |
| `pagination.totalPages` | `integer` | Liczba stron przy aktualnym `limit`. |

## Możliwe kody odpowiedzi

| Kod | Opis |
|-----|------|
| `200` | Sukces — zwrócono listę użytkowników. |
| `400` | Nieprawidłowe parametry (np. `page=0`, `limit=-1`). |
| `401` | Brak lub nieprawidłowa autoryzacja (jeśli endpoint jest chroniony). |
| `500` | Błąd serwera. |

## Przykład bez filtra roli

```http
GET /api/users HTTP/1.1
```

Odpowiednik: `page=1`, `limit=10`, bez filtra `role`.
