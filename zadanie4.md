Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Oto praktyczne podejście — od diagnozy po ograniczenia i optymalizację.

1. Zdiagnozuj źródło
docker stats
Pokaże zużycie RAM i CPU na kontener. Potem wejdź do kontenera i sprawdź procesy:

docker exec -it <nazwa_kontenera> sh
# lub: top, ps aux
Częste przyczyny:

wyciek pamięci w aplikacji (Node, Java, Python),
zbyt duży heap (np. Node domyślnie może rosnąć),
cache w aplikacji bez limitu,
wiele procesów w jednym kontenerze,
zbyt duży obraz z niepotrzebnymi zależnościami.
2. Ogranicz pamięć kontenera
Wymuś limit, żeby kontener nie zjadał całej RAM hosta:

docker run -m 512m --memory-swap 512m ...
W docker-compose.yml:

services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
Gdy limit zostanie przekroczony, kontener może zostać zatrzymany (OOM) — to sygnał, że trzeba optymalizować aplikację, nie tylko podnieść limit.

3. Optymalizuj aplikację
Środowisko	Działanie
Node.js
NODE_OPTIONS=--max-old-space-size=256 (limit heap w MB)
Java
-Xmx512m w JAVA_OPTS
Python
mniejsze pule workerów, cache z TTL i limitem rozmiaru
Sprawdź też logi, metryki i profiler — czy pamięć rośnie w czasie (wyciek).

4. Uprość obraz i kontener
Użyj mniejszego obrazu (node:18-alpine zamiast pełnego node:18).
Instaluj tylko zależności produkcyjne: npm ci --omit=dev.
Jeden proces na kontener (np. tylko node, bez zbędnego supervisora).
Multi-stage build — mniejszy finalny obraz.
5. Posprzątaj środowisko Dockera
Czasem „pamięć” idzie na hosta przez warstwy i cache, nie sam działający kontener:

docker system prune -a
docker builder prune
(Uwaga: prune -a usuwa nieużywane obrazy.)

6. Typowy workflow
docker stats → który kontener?
Logi + metryki aplikacji → wyciek czy normalne obciążenie?
Limit -m / memory w compose → ochrona hosta.
Optymalizacja kodu i obrazu → trwałe rozwiązanie.
Podsumowanie: limit pamięci chroni serwer; prawdziwe rozwiązanie to znalezienie przyczyny (wyciek, cache, złe ustawienia JVM/Node) i lżejszy obraz. Jeśli podasz typ aplikacji (Node, Java itd.), można doprecyzować konkretne ustawienia.

Jesteś doświadczonym DevOps Engineerem z 10-letnim doświadczeniem. Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Poniżej podejście, które w produkcji stosuję od diagnozy do trwałej poprawki — nie tylko „podnieś limit RAM”.

1. Ustal, czy problem jest realny
Najpierw oddziel rzeczywiste zużycie procesu od metryki Dockera, która bywa myląca.

docker stats --no-stream
docker inspect <container> --format '{{.HostConfig.Memory}}'
W kontenerze (jeśli masz narzędzia):

docker exec <container> ps aux --sort=-%mem | head
Na hoście Linux:

cat /sys/fs/cgroup/.../memory.current   # cgroup v2
Czerwone flagi: pamięć rośnie godzinami (wyciek), skoki po deployu (nowa wersja), OOM w dmesg / docker inspect → OOMKilled: true.

2. Znajdź winowajcę: aplikacja vs runtime vs obraz
Warstwa	Co sprawdzić
Aplikacja
heap Node/Java, connection pool, cache bez TTL, duże bufory uploadów
Runtime
liczba workerów (Gunicorn, PM2, cluster Node) × RAM na proces
Obraz
pełny Debian zamiast Alpine/distroless, devDependencies w produkcji
Platforma
brak limitów cgroup → kontener konkuruje z całym hostem
Bez tego rozróżnienia limit -m tylko maskuje problem albo ubija kontener w szczycie.

3. Ochrona hosta — limity cgroup (obowiązkowe w prod)
Docker run:

docker run -m 768m --memory-swap 768m --oom-kill-disable=false ...
Compose (Swarm-style limits):

services:
  app:
    mem_limit: 768m
    memswap_limit: 768m
Kubernetes (tam to standard):

resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "768Mi"
Zasada: requests = planowanie schedulera, limits = twardy sufit. Same limity bez requests w K8s to częsty błąd operacyjny.

Po OOM: kubectl describe pod / docker inspect → State.OOMKilled. To dane do post-mortem, nie „restart i zapomnij”.

4. Naprawa aplikacji (tam jest 80% przypadków)
Node.js

ENV NODE_OPTIONS="--max-old-space-size=384"
Plus: jeden proces na kontener (bez pm2 w środku — to rola orchestratora), monitoring heap (clinic, APM).

Java: -XX:MaxRAMPercentage=75.0 (lepiej niż sztywne -Xmx w kontenerach).

Python/Go: limity workerów, rozmiar kolejek, streaming zamiast ładowania całych plików do RAM.

Włącz metryki, nie tylko docker stats: Prometheus + cAdvisor / kube-state-metrics, albo APM (Datadog, New Relic). Szukasz trendu pamięć ↑ przy stałym ruchu = leak.

5. Obraz i Dockerfile — tanie wygrane
node:18-alpine lub distroless na produkcję
multi-stage: build w jednym etapie, runtime w drugim
npm ci --omit=dev — devDependencies nie w finalnym obrazie
.dockerignore — bez node_modules, testów, .git
jeden CMD, jeden główny proces (PID 1 = aplikacja, nie shell)
Mniejszy obraz ≠ mniej RAM w runtime, ale mniej warstw do debugowania i mniej „przypadkowych” procesów.

6. Operacje na klastrze / hoście
Gdy „Docker zjada pamięć”, często chodzi o host, nie jeden kontener:

docker system df
docker container prune
Stare obrazy, zatrzymane kontenery, build cache — to nie zastępuje limitów na działających usługach.

Na Docker Desktop (Windows/Mac) limit RAM VM Dockera ustawiasz w Settings → Resources — inaczej niż na Linuxie z natywnym cgroup.

7. Workflow, którego używam w incydencie
Tak
Nie
Tak
Nie
Alert: wysoka RAM
OOMKilled?
Logi + heap dump / APM
docker stats + trend 24h
Wzrost liniowy?
Szczyt ruchu / batch?
Fix w kodzie / pool / cache
Skalowanie H / kolejka
Limity + requests w prod
Potwierdź kontener i trend (5 min vs 5 dni).
Sprawdź OOM i wersję deployu.
Profil w aplikacji, nie tylko restart.
Ustaw limity + alerty (np. 80% limitu przez 15 min).
Zweryfikuj po deployu na stagingu z load testem.
8. Czego nie robić
Nieskończony -m — kontener zabije cały host.
Wyłączanie OOM killera (--oom-kill-disable) bez bardzo dobrego powodu.
Tylko docker system prune przy rosnącym heapie — to nie naprawia leaku.
Wiele usług w jednym kontenerze — trudna diagnostyka i zła izolacja zasobów.
Podsumowanie: limit pamięci to bezpieczeństwo operacyjne; rozwiązanie to profil aplikacji + lekki obraz + observability. W 10 latach najczęściej wygrywa: metryka trendu RAM → fix w kodie (cache/pool/leak) → sensowne limits/requests → mniejszy obraz produkcyjny.

Jeśli chcesz, mogę dopisać gotowy fragment do docker-compose.yml albo do Twojego Dockerfile z Node 18 pod konkretny limit (np. 512 MB).

druga odpowiedz jest o większej złożoności