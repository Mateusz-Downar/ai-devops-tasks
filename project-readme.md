# Simple Task API

REST API do zarządzania zadaniami, napisane w **Node.js** z **Express** i **MongoDB**.

## Opis

Simple Task API umożliwia tworzenie i zarządzanie zadaniami w aplikacjach i zespołach deweloperskich. API obsługuje pełny cykl CRUD, filtrowanie listy zadań oraz prostą autoryzację użytkowników.

**Główne funkcje:**

- Tworzenie, odczytywanie, aktualizacja i usuwanie zadań (CRUD)
- Filtrowanie zadań według **statusu** i **priorytetu**
- Prosta **autoryzacja** użytkowników (logowanie / token)

## Instalacja

### Wymagania

- Node.js 18+
- MongoDB 6+ (lokalnie lub Docker)
- npm

### Kroki

```bash
# Sklonuj repozytorium
git clone https://github.com/example/simple-task-api.git
cd simple-task-api

# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp .env.example .env
# Uzupełnij: MONGODB_URI, JWT_SECRET, PORT

# Uruchom MongoDB (przykład Docker)
docker run -d -p 27017:27017 --name mongo mongo:6

# Uruchom API
npm start
```

Domyślnie serwer nasłuchuje na `http://localhost:3000`.

### Tryb deweloperski

```bash
npm run dev
```

## Użycie

### Autoryzacja

```bash
# Rejestracja
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Logowanie (zwraca token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

Kolejne żądania wymagają nagłówka:

```http
Authorization: Bearer <token>
```

### Przykład: utworzenie zadania

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Wdrożyć endpoint health",
    "status": "pending",
    "priority": "high"
  }'
```

### Przykład: lista z filtrem

```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high" \
  -H "Authorization: Bearer <token>"
```

## Endpointy API

### Autoryzacja

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja użytkownika |
| `POST` | `/api/auth/login` | Logowanie, zwrot tokenu |

### Zadania

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/tasks` | Lista zadań (filtry: `status`, `priority`) |
| `GET` | `/api/tasks/:id` | Pojedyncze zadanie |
| `POST` | `/api/tasks` | Utworzenie zadania |
| `PUT` | `/api/tasks/:id` | Aktualizacja zadania |
| `DELETE` | `/api/tasks/:id` | Usunięcie zadania |

### Parametry zapytania (`GET /api/tasks`)

| Parametr | Opis | Przykład |
|----------|------|----------|
| `status` | Filtr statusu | `pending`, `in-progress`, `completed` |
| `priority` | Filtr priorytetu | `low`, `medium`, `high` |

### Przykładowy obiekt zadania

```json
{
  "id": "64a1b2c3d4e5f6789012345",
  "title": "Przygotować dokumentację API",
  "description": "README i przykłady curl",
  "status": "in-progress",
  "priority": "medium",
  "createdAt": "2025-05-19T10:00:00.000Z",
  "updatedAt": "2025-05-19T12:30:00.000Z"
}
```

### Kody odpowiedzi

| Kod | Znaczenie |
|-----|-----------|
| `200` | Sukces (GET, PUT) |
| `201` | Utworzono (POST) |
| `204` | Usunięto (DELETE) |
| `400` | Błędne dane wejściowe |
| `401` | Brak lub nieprawidłowy token |
| `404` | Nie znaleziono zasobu |
| `500` | Błąd serwera |

## Licencja

MIT
