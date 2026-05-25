CURSOR prawdzam kontekst projektu i zadanie, żeby dopasować przykładowy Dockerfile dla Node.

Przykładowy Dockerfile dla aplikacji Node.js (wieloetapowy build, mniejszy obraz):

# Etap 1: budowa
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
# Etap 2: uruchomienie (produkcja)
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
Wersja prostsza (bez buildu, np. czysty JavaScript):

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
USER node
CMD ["node", "index.js"]
Co tu jest ważne:

node:22-alpine — lekki obraz z Node 22
npm ci — powtarzalna instalacja z lockfile (wymaga package-lock.json)
NODE_ENV=production — tryb produkcyjny
USER node — proces nie działa jako root
EXPOSE 3000 — port aplikacji (dostosuj do swojego)
Uruchomienie:

docker build -t moja-aplikacja-node .
docker run -p 3000:3000 moja-aplikacja-node
Jeśli masz package.json z innym skryptem startowym (np. "start": "node server.js"), zmień CMD na npm start albo właściwą ścieżkę pliku. Mogę dopasować Dockerfile do Twojego projektu, jeśli wkleisz strukturę plików lub package.json.

drugi prompt 
Napisz prosty Dockerfile dla aplikacji Node.js, który:

- używa Node 18 jako obrazu bazowego

- kopiuje pliki package.json i package-lock.json

- instaluje zależności

- kopiuje resztę plików aplikacji

- wystawia port 3000

- uruchamia aplikację poleceniem "npm start"

FROM node:18
WORKDIR /app
Utworzyłem plik Dockerfile w katalogu projektu:

FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
Kolejność kroków: najpierw kopiowane są pliki zależności i uruchamiane npm install (lepsze wykorzystanie cache warstw Dockera), potem reszta aplikacji, na końcu port 3000 i start przez npm start.

Uruchomienie (w katalogu z package.json i skryptem "start"):

docker build -t node-app .
docker run -p 3000:3000 node-app
W package.json musi być np. "scripts": { "start": "node index.js" } i aplikacja powinna nasłuchiwać na porcie 3000.

ODPOWIEDZ JEST KONKRETNA NIE MA WARIANTÓW ITP