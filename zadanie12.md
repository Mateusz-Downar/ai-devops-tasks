stary 
def find_duplicates(list_of_items):
    duplicates = []
    for i in range(len(list_of_items)):
        for j in range(i+1, len(list_of_items)):
            if list_of_items[i] == list_of_items[j] and list_of_items[i] not in duplicates:
                duplicates.append(list_of_items[i])
    return duplicates

    poprawiony 

    def find_duplicates(list_of_items):
    seen = set()
    duplicates = []
    for item in list_of_items:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.add(item)
    return duplicates

    Wersja 1: jedna pętla + zbiór (O(n))
def find_duplicates(list_of_items):
    seen = set()
    duplicates = []
    for item in list_of_items:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.add(item)
    return duplicates
seen — element już był wcześniej
duplicates — dodajemy tylko przy drugim (i kolejnym) wystąpieniu, ale każdy element tylko raz w wyniku
item in seen i item not in duplicates — O(1) dla set/listy przy małym wyniku.

Wersja 2: Counter (czytelna, też O(n))
from collections import Counter
def find_duplicates(list_of_items):
    counts = Counter(list_of_items)
    return [item for item, count in counts.items() if count > 1]
Liczy wystąpienia w jednym przejściu, potem zwraca elementy z count > 1.

Uwaga: kolejność w wyniku = kolejność pierwszego wystąpienia w Counter (Python 3.7+ zachowuje kolejność wstawiania).

Wersja 3: tylko set (bez zachowania kolejności w wyniku)
def find_duplicates(list_of_items):
    seen = set()
    return list({item for item in list_of_items if item in seen or seen.add(item)})
Ta wersja jest „sprytna”, ale mniej czytelna — w zadaniach edukacyjnych lepsza jest wersja 1 lub 2.

Porównanie
Wersja	Czas	Czytelność
Oryginał (podwójna pętla)
O(n²)
OK
Pętla + seen
O(n)
Bardzo dobra
Counter
O(n)
Najczytelniejsza
Przykład
find_duplicates([1, 2, 2, 3, 3, 3])
# → [2, 3]  (wszystkie wersje)
Podsumowanie: tak, warto zamienić zagnieżdżone pętle na jedno przejście z set albo Counter — dla dużych list różnica jest duża (np. 10 000 elementów: miliony porównań vs ~10 000 operacji).