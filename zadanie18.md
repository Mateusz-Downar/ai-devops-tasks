5 kluczowych praktyk bezpieczeństwa Docker w produkcji
1. Uruchamiaj kontenery jako użytkownik nieuprzywilejowany (non-root)
W Dockerfile: USER node / dedykowany użytkownik — nie root.
Ogranicza skutki przejęcia kontenera (eskalacja, zapis do systemu hosta).
2. Używaj minimalnych, zaufanych obrazów bazowych
Preferuj Alpine, distroless lub oficjalne obrazy ze znanymi tagami (node:18-alpine, nie latest bez pinowania).
Regularnie skanuj obrazy (Trivy, Docker Scout) i aktualizuj warstwy z CVE.
3. Nie trzymaj sekretów w obrazie ani w compose w repo
Hasła, tokeny, klucze — secrets (Docker/Kubernetes), vault, zmienne z CI.
Pliki .env w .gitignore; w produkcji — menedżer sekretów, nie ENV PASSWORD=... w Dockerfile.
4. Ogranicz sieć i ekspozycję portów
Wystawiaj na świat tylko to, co musi (np. reverse proxy / load balancer).
Bazy i cache bez mapowania portów na host — tylko wewnętrzna sieć Docker/K8s.
Stosuj firewall, segmentację sieci, TLS na brzegu.
5. Twarde limity zasobów i konfiguracja runtime
mem_limit, cpus, read_only filesystem gdzie możliwe, no-new-privileges.
Wyłącz możliwość montowania docker.sock w kontenerze aplikacji (pełna kontrola hosta).
Aktualizuj Docker Engine i runtime; w K8s — Pod Security Standards / polityki admission.
Podsumowanie: w produkcji łączysz mały, nie-rootowy obraz, brak sekretów w repo, minimalną sieć, skanowanie podatności i limity + aktualizacje — to baza; do tego dochodzą logi, backupy i least privilege na hoście/orchestratorze.

Jak mogę zaimplementować pierwszą z tych praktyk w moim Dockerfile i docker-compose.yml?

# Zależności — instalacja jako root, potem przekazanie własności użytkownikowi node
COPY package.json package-lock.json ./
RUN npm install
    build: .
    user: "node"
    security_opt:
      - no-new-privileges:true
Zaktualizowałem Dockerfile i docker-compose.yml. Oto jak wdrożyć praktykę 1: non-root.

Dockerfile
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && chown -R node:node /app
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "start"]
Element	Po co
chown -R node:node /app po npm install
node_modules nie zostaje na root — inaczej USER node nie ma praw zapisu
COPY --chown=node:node
Pliki aplikacji należą do użytkownika node
USER node
Proces npm start nie działa jako root
Obraz node:18 ma gotowego użytkownika node (uid 1000).

docker-compose.yml (serwis app)
  app:
    build: .
    user: "node"
    security_opt:
      - no-new-privileges:true
    ports:
      - "3000:3000"
Element	Po co
user: "node"
Wymusza non-root nawet gdy ktoś usunie USER z Dockerfile
no-new-privileges:true
Blokuje eskalację uprawnień w kontenerze
Weryfikacja
docker compose build app
docker compose run --rm app whoami
# oczekiwane: node
docker compose run --rm app id
# uid=1000(node) gid=1000(node)
Pozostałe serwisy w Twoim compose
db (postgres) — oficjalny obraz i tak działa jako użytkownik postgres, nie root w sensie pełnych uprawnień hosta.
web (nginx) — domyślny nginx startuje mastera jako root; w produkcji często używa się nginxinc/nginx-unprivileged albo własnego Dockerfile z USER nginx.
Uwaga: Jeśli aplikacja musi pisać do katalogu w kontenerze (uploady, cache), nadaj prawa tylko temu katalogowi (chown / wolumen), nie wracaj do root w CMD.