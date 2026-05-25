Funkcja getCompletedTaskTitles przyjmuje tablicę zadań (id, title, status) i zwraca same tytuły ukończonych zadań, posortowane po id rosnąco.

Przetwarzanie w trzech krokach:

filter — zostają tylko zadania ze status === 'completed'.
sort — sortowanie po id (a.id - b.id).
map — z każdego zadania brany jest tylko title.
Oryginalna tablica nie jest zmieniana — każda metoda zwraca nową tablicę.

Przykład użycia
const { getCompletedTaskTitles } = require('./getCompletedTaskTitles');
const tasks = [
  { id: 3, title: 'Wdrożenie na produkcję', status: 'completed' },
  { id: 1, title: 'Konfiguracja repozytorium', status: 'pending' },
  { id: 2, title: 'Testy jednostkowe', status: 'completed' },
  { id: 4, title: 'Code review', status: 'in-progress' },
];
const titles = getCompletedTaskTitles(tasks);
console.log(titles);
// ['Testy jednostkowe', 'Wdrożenie na produkcję']
Ukończone: id 2 i 3 → po sortowaniu najpierw 2, potem 3.

Szybki test w terminalu:

node -e "const { getCompletedTaskTitles } = require('./getCompletedTaskTitles'); console.log(getCompletedTaskTitles([{ id: 2, title: 'B', status: 'completed' }, { id: 1, title: 'A', status: 'completed' }]));"
Wynik: [ 'A', 'B' ] (kolejność po id, nie po tytule).

Opis zapisałem też w zadanie17.md.