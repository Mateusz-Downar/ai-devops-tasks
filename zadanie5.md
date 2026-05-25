Stwórz prosty diagram ASCII Art przedstawiający połączenie klienta, serwera aplikacji i bazy danych.

+-------------+ HTTP/HTTPS +-------------------+ | | ------------------------> | | | KLIENT | <------------------------ | SERWER APLIKACJI | | (przeglą- | odpowiedź | (backend) | | darka) | | | +-------------+ +---------+---------+ | | SQL / TCP | (np. port 5432) v +-------------------+ | | | BAZA DANYCH | | (PostgreSQL, | | MySQL, itd.) | | | +-------------------+

Przepływ:

Klient wysyła żądanie (np. GET /api/users)
Serwer aplikacji przetwarza logikę i odpytuje bazę
Baza zwraca dane → serwer buduje odpowiedź → klient
Dodaj do diagramu opisy elementów i kierunki przepływu danych.

Rozszerzony diagram z opisami elementów i kierunkami przepływu:

================================================================================
                    ARCHITEKTURA: KLIENT - APLIKACJA - BAZA DANYCH
================================================================================
  ELEMENTY:
  ---------
  [A] KLIENT          - przeglądarka lub aplikacja mobilna; inicjuje żądania
  [B] SERWER APLIKACJI - backend (Node, Java, Python); logika biznesowa, API
  [C] BAZA DANYCH     - trwałe dane (PostgreSQL, MySQL); tylko serwer ma dostęp
  PRZEPŁYW DANYCH (numeracja kroków):
  ------------------------------------
       ┌─────────────────────────────────────────────────────────────┐
       │  [A] KLIENT                                                 │
       │  • UI, formularze, przyciski                                │
       │  • Nie łączy się bezpośrednio z bazą                        │
       └──────────────────────────┬──────────────────────────────────┘
                                  │
                    ① żądanie HTTP/HTTPS (np. GET /api/users)
                                  │  ──────────────────────────────>
                                  │
                                  v
       ┌─────────────────────────────────────────────────────────────┐
       │  [B] SERWER APLIKACJI                                       │
       │  • REST/GraphQL, autoryzacja, walidacja                     │
       │  • Jedyny komponent widoczny z internetu (oprócz klienta) │
       └──────────────┬──────────────────────────▲──────────────────┘
                      │                          │
         ② zapytanie SQL│                          │ ④ wynik zapytania
           (SELECT/INSERT)│                          │    (wiersze, status)
                      │                          │
                      v                          │
       ┌─────────────────────────────────────────────────────────────┐
       │  [C] BAZA DANYCH                                            │
       │  • Tabele, indeksy, transakcje                              │
       │  • Port wewnętrzny (np. 5432) — nie wystawiony klientowi    │
       └─────────────────────────────────────────────────────────────┘
                      │
                      │  ③ serwer przetwarza dane (mapowanie, reguły)
                      │
                      v
       ┌─────────────────────────────────────────────────────────────┐
       │  [B] SERWER APLIKACJI  →  buduje odpowiedź JSON/HTML          │
       └──────────────────────────┬──────────────────────────────────┘
                                  │
                    ⑤ odpowiedź HTTP (200 OK + body)
                                  │  <──────────────────────────────
                                  v
       ┌─────────────────────────────────────────────────────────────┐
       │  [A] KLIENT  →  wyświetla dane użytkownikowi                │
       └─────────────────────────────────────────────────────────────┘
  LEGENDA STRZAŁEK:
  -----------------
  ──────────────>   przepływ żądania / zapytań (klient → serwer → baza)
  <──────────────   przepływ odpowiedzi (baza → serwer → klient)
  PRZYKŁAD (odczyt listy użytkowników):
  ------------------------------------
  ① Klient:     GET /api/users
  ② Serwer:     SELECT * FROM users;
  ③ Baza:       zwraca rekordy
  ④ Serwer:     { "users": [ ... ] }
  ⑤ Klient:     renderuje listę na ekranie
================================================================================
Zasady bezpieczeństwa (widoczne na diagramie):

Klient komunikuje się tylko z serwerem aplikacji (①, ⑤).
Baza jest dostępna tylko dla serwera (②, ④) — nigdy bezpośrednio z przeglądarki.
Mogę dopisać ten diagram na końcu zadanie4.md, jeśli chcesz go mieć w repozytorium