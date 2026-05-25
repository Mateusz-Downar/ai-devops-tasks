May 19 10:15:32 server dockerd[1234]: time="2025-05-19T10:15:32.123456789Z" level=info msg="Container 78a2b3c4 health status changed from starting to healthy"
May 19 10:16:45 server dockerd[1234]: time="2025-05-19T10:16:45.987654321Z" level=info msg="Container 78a2b3c4 failed to connect to 172.17.0.3:5432: connection refused"
May 19 10:16:47 server dockerd[1234]: time="2025-05-19T10:16:47.246813579Z" level=warning msg="Container 78a2b3c4 health status changed from healthy to unhealthy"


Baza niedostępna lub nie nasłuchuje
connection refused na 5432 oznacza zwykle:

PostgreSQL nie działa w kontenerze docelowym,
startuje wolniej niż aplikacja,
nasłuchuje tylko na localhost wewnątrz kontenera, a nie na interfejsie sieci Docker.
2. Race condition przy starcie
O 10:15 aplikacja była healthy, ale o 10:16 nie ma połączenia z DB — typowy scenariusz:

healthcheck sprawdza tylko HTTP/port aplikacji, nie bazę,
albo baza później padła / została zrestartowana,
albo depends_on w Compose nie czeka, aż Postgres będzie gotowy (tylko „kontener wystartował”, nie „accept connections”).
3. Fałszywie pozytywny healthcheck
Kontener był healthy, mimo że integracja z DB mogła jeszcze nie działać — healthcheck jest zbyt płytki (np. tylko curl localhost bez testu połączenia do Postgresa).

4. Sieć Docker
172.17.0.3 to IP w sieci bridge — możliwe też:

zła nazwa hosta w aplikacji (localhost zamiast db),
kontener bazy w innej sieci,
zmiana IP po restarcie (rzadziej przy nazwie serwisu).