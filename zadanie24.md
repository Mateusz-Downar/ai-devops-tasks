# Zadanie 24 — interpretacja metryk serwera API (24h)

## Dane wejściowe

| Metryka | Wartość |
|---------|---------|
| Średni czas odpowiedzi | 230 ms |
| p95 czasu odpowiedzi | 450 ms |
| p99 czasu odpowiedzi | 1200 ms |
| Liczba zapytań | 15 000 |
| Błędy 5xx | 120 |
| CPU (średnio / max) | 45% / 80% |
| Pamięć (średnio / max) | 2,1 GB / 3,5 GB (limit 4 GB) |

---

## Interpretacja

### Czasy odpowiedzi

- **Średnia 230 ms** — typowe API działa w akceptowalnym zakresie; większość requestów nie jest „wolna”.
- **p95 = 450 ms** — co najmniej 5% użytkowników czeka prawie pół sekundy; przy interaktywnym UI może być odczuwalne.
- **p99 = 1200 ms** — **najpoważniejszy sygnał latencji**: 1% requestów trwa do 1,2 s, czyli ok. **5× dłużej** niż średnia.

Duży rozstrzał między średnią a p99 oznacza, że problem nie dotyczy całego ruchu równomiernie, lecz **wybranych ścieżek** (wolne endpointy, zapytania DB, timeouty, szczyty obciążenia).

### Ruch i niezawodność

- **15 000 zapytań / 24 h** ≈ 10,4 req/min — **niski ruch**; łatwiej analizować incydenty.
- **120 błędów 5xx** → współczynnik błędu **0,8%** (120 ÷ 15 000).

Dla API produkcyjnego częsty cel to **< 0,1–1%** 5xx. **0,8%** to już poziom wymagający wyjaśnienia (błąd aplikacji, baza, pamięć, sieć).

### Zasoby

- **CPU 45% / max 80%** — średnio zapas jest; szczyty 80% sugerują chwilowe przeciążenie (nie stale).
- **RAM 2,1 GB średnio, max 3,5 GB z 4 GB** — szczyt to **~87,5%** dostępnej pamięci. To **wąskie gardło bliższe niż CPU**: ryzyko OOM, restartów procesu/kontenera i kolejnych 5xx.

---

## Potencjalne problemy

| Problem | Dowód w metrykach | Możliwa przyczyna |
|---------|-------------------|-------------------|
| **Ogon latencji (tail latency)** | p99 >> średnia (1200 vs 230 ms) | Wolne SQL, brak indeksów, N+1, brak cache, synchroniczne call’e zewnętrzne |
| **Niestabilna niezawodność** | 0,8% 5xx przy niskim ruchu | Wyjątki w kodzie, timeout DB, brak pamięci, błędy połączeń (np. `connection refused`) |
| **Presja na pamięć** | max 3,5/4 GB | Wyciek pamięci (Node heap), zbyt duży cache, brak limitów kontenera / brak skalowania |
| **Szczyty CPU** | max 80% | Krótkie burst’y przy ciężkich requestach lub GC pod presją RAM |
| **Ukryte SLA** | p95 450 ms | Część klientów może nie spełniać oczekiwań mimo „ładnej” średniej |

---

## Sugestie poprawy wydajności

### 1. Diagnostyka (najpierw)

- Przejrzyj **120 odpowiedzi 5xx** — endpoint, timestamp, stack trace.
- W APM / logach wyfiltruj requesty **> 1 s** (korelacja z p99).
- Sprawdź **MongoDB/PostgreSQL**: wolne zapytania, brak indeksów, connection pool.
- Monitoruj **trend RAM** — czy rośnie w czasie (wyciek)?

### 2. Latencja (p95 / p99)

- Dodaj **indeksy** pod filtry (`status`, `priority`, `userId`).
- Wprowadź **cache** (Redis) dla często czytanych list.
- Unikaj **N+1** (populate / agregacje w jednym zapytaniu).
- Ustaw **timeouty** na call’ach zewnętrznych; nie blokuj event loop.
- Rozważ **paginację** i limity rozmiaru odpowiedzi.

### 3. Pamięć i stabilność

- Ustaw limity kontenera i alert przy **RAM > 85%**.
- Node: `NODE_OPTIONS=--max-old-space-size=...` zgodnie z limitem 4 GB.
- Profil heap przy powtarzalnym wzroście do 3,5 GB.
- Healthcheck uwzględniający **połączenie z bazą**, nie tylko HTTP 200.

### 4. Błędy 5xx

- Retry z backoff tylko tam, gdzie bezpieczne (idempotentne GET).
- Circuit breaker na zależnościach zewnętrznych.
- `depends_on` + **healthcheck bazy** w Docker Compose (jak w zadaniu 14).

### 5. Monitoring i cele

| Alert | Próg (przykład) |
|-------|-----------------|
| p99 latency | > 1000 ms przez 5 min |
| Współczynnik 5xx | > 1% przez 15 min |
| Pamięć | > 85% limitu |
| CPU | > 90% przez 10 min |

---

## Podsumowanie

| Obszar | Status | Priorytet |
|--------|--------|-----------|
| Średnia latencja | OK | Niski |
| p99 / ogon | Do poprawy | **Wysoki** |
| 5xx (0,8%) | Do poprawy | **Wysoki** |
| Pamięć (max 87,5%) | Ryzyko OOM | **Wysoki** |
| CPU | Umiarkowanie OK | Średni |

**W skrócie:** API jest przeciętnie szybkie, ale **1% najwolniejszych requestów**, **błędy 5xx** i **szczyt pamięci blisko limitu 4 GB** wskazują na problemy w wybranych ścieżkach i w warstwie operacyjnej — nie na ogólne „przeciążenie CPU”. Najpierw logi 5xx + profil wolnych endpointów i pamięci, potem optymalizacja DB/cache i twardsze limity zasobów.
