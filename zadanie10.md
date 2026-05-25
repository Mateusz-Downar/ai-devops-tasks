Dlaczego ważne jest ignorowanie tych plików?

Ignorowanie tych plików w .gitignore chroni repozytorium, bezpieczeństwo i współpracę w zespole.

1. node_modules/
Tysiące plików — repozytorium rośnie niepotrzebnie, git clone i CI są wolniejsze.
Zależności odtworzysz z package.json / package-lock.json przez npm install.
Na innym OS mogą być problemy (np. natywne moduły pod Windows vs Linux).
2. .env i pliki z hasłami
Zawierają hasła, klucze API, URI do MongoDB — nie powinny trafić na GitHuba.
Po wycieku trzeba rotować wszystkie sekrety; historia Gita je często zostawia.
W repo trzymasz tylko .env.example (szablon bez prawdziwych wartości).
3. Dane MongoDB (data/, mongo-data/, dump/)
To lokalna baza — duże, zmienne, specyficzne dla Twojej maszyny.
Mogą zawierać dane osobowe (RODO) — nie commitujesz ich do publicznego repo.
W zespole każdy ma własną bazę (Docker + wolumen); produkcja ma osobne środowisko.
4. docker-compose.override.yml
Służy do lokalnych zmian (inne porty, debug) — u każdego inny.
Commit głównego docker-compose.yml wystarczy; override zostaje u Ciebie.
5. dist/, build/, coverage/
To wynik buildu/testów — generujesz go z kodu źródłowego.
Commitowanie powoduje konflikty i „szum” w diffach przy każdym buildzie.
CI i tak buduje projekt od zera.
6. Logi (*.log, logs/)
Ciągle się zmieniają, nie niosą wartości dla wersjonowania kodu.
Mogą przypadkiem zawierać ścieżki, tokeny, dane użytkowników z requestów.
7. Pliki systemowe (.DS_Store, Thumbs.db)
Metadane macOS/Windows — nie mają związku z projektem, tylko zaśmiecają repo.
Podsumowanie: Do Gita trafia to, co definiuje projekt (kod, package.json, Dockerfile, docker-compose.yml, .env.example). Do .gitignore — to, co jest generowane, lokalne, wrażliwe lub ciężkie. Dzięki temu repo jest mniejsze, bezpieczniejsze i każdy developer dostaje ten sam punkt startu, a nie Twoją bazę i hasła.