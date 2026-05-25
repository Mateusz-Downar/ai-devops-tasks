# Zadanie 23 — findPairs: złożoność i optymalizacja

## Algorytm oryginalny (`find-pairs.js`)

Dwie zagnieżdżone pętle sprawdzają każdą unikalną parę indeksów `(i, j)`, gdzie `j > i`.

```javascript
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] + arr[j] === targetSum) {
      pairs.push([arr[i], arr[j]]);
    }
  }
}
```

## Złożoność czasowa

| Wersja | Notacja | Opis |
|--------|---------|------|
| **Oryginalna** | **O(n²)** | Dla `n` elementów — około `n(n-1)/2` porównań par |
| **Zoptymalizowana** | **O(n)** | Jedno przejście po tablicy + operacje O(1) na `Map` |

Przy `n = 10 000`:
- O(n²) ≈ 50 mln operacji
- O(n) ≈ 10 tys. operacji

## Złożoność pamięciowa

| Wersja | Notacja | Opis |
|--------|---------|------|
| **Oryginalna** | **O(k)** | `k` = liczba znalezionych par w `pairs` (wynik algorytmu) |
| **Zoptymalizowana** | **O(n + k)** | `Map` przechowuje do `n` liczników + tablica wyników `pairs` |

Dodatkowa pamięć w wersji zoptymalizowanej to struktura `seen` — w zamian za szybszy czas.

## Czy można zoptymalizować?

**Tak.** Zamiast sprawdzać wszystkie pary, w jednym przejściu:

1. Dla każdej wartości `value` liczysz `complement = targetSum - value`.
2. Jeśli `complement` już był w tablicy (`Map`), dodajesz parę `[complement, value]`.
3. Zwiększasz licznik wystąpień `value` w `Map` (obsługa duplikatów).

Plik: **`find-pairs-optimized.js`**

### Przykład działania optymalizacji

```
arr = [2, 4, 3, 5, 7], targetSum = 9

value=2  → complement=7, seen={}           → seen={2:1}
value=4  → complement=5, seen={2:1}        → seen={2:1, 4:1}
value=3  → complement=6, seen={2,4}        → seen={..., 3:1}
value=5  → complement=4, 4 jest w seen!   → para [4, 5]
value=7  → complement=2, 2 jest w seen!   → para [2, 7]

Wynik: [[4, 5], [2, 7]]
```

## Porównanie wersji

| Kryterium | Oryginalna | Zoptymalizowana |
|-----------|------------|-----------------|
| Czas | O(n²) | O(n) |
| Pamięć dodatkowa | Minimalna | O(n) (`Map`) |
| Czytelność | Prostsza | Nieco trudniejsza |
| Duplikaty w tablicy | Działa | Działa (liczniki w `Map`) |
| Kolejność par | `(i, j)`, `i < j` | Kolejność przejścia (complement przed value) |

## Kiedy której wersji użyć

- **Małe tablice (n < 100)** — różnica nieistotna, oryginał wystarczy.
- **Duże tablice, API, dane streaming** — wersja z `Map` (O(n)).
- **Bardzo mała pamięć** — oryginał O(n²) bez struktury pomocniczej (poza wynikiem).

## Pliki w projekcie

| Plik | Opis |
|------|------|
| `find-pairs.js` | Algorytm oryginalny O(n²) |
| `find-pairs-optimized.js` | Algorytm z hash mapą O(n) |
| `zadanie-23.md` | Niniejsza analiza |

## Przykład użycia

```javascript
const { findPairs } = require('./find-pairs');
const { findPairs: findPairsFast } = require('./find-pairs-optimized');

const arr = [2, 4, 3, 5, 7];
const target = 9;

console.log(findPairs(arr, target));       // [[4, 5], [2, 7]]
console.log(findPairsFast(arr, target));   // [[4, 5], [2, 7]]
```
