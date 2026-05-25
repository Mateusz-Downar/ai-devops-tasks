Przed	Po
Długi łańcuch if / else if
Jedna mapa ENV_CONFIG
Powtórzone obiekty w każdej gałęzi
Konfiguracja w jednym miejscu
Domyślna gałąź else z duplikatem dev
?? ENV_CONFIG[DEFAULT_ENV]
Trudne dodanie środowiska
Nowy klucz w ENV_CONFIG
Korzyści
Czytelność — widać wszystkie środowiska w jednej tabeli.
Utrzymanie — zmiana URL/timeoutu tylko w jednym wpisie.
Mniej błędów — brak kopiowania tego samego bloku w else.
Domyślne środowisko — jawne DEFAULT_ENV zamiast ukrytego duplikatu w else.
Zachowanie jest takie samo: nieznane env → konfiguracja jak dla development.