#!/usr/bin/env bash
# Sprawdza, czy daemon Docker odpowiada; jeśli nie — uruchamia usługę (systemd).

set -euo pipefail

if docker info &>/dev/null; then
  echo "Usługa Docker działa."
  exit 0
fi

echo "Docker nie odpowiada. Próbuję uruchomić usługę..."

if ! command -v systemctl &>/dev/null; then
  echo "Błąd: brak systemctl (np. Docker Desktop na Windows/Mac — uruchom Docker ręcznie)."
  exit 1
fi

if systemctl is-active --quiet docker 2>/dev/null; then
  echo "Usługa systemd 'docker' jest aktywna, ale daemon nie odpowiada. Sprawdź logi: journalctl -u docker"
  exit 1
fi

sudo systemctl start docker
sleep 2

if docker info &>/dev/null; then
  echo "Docker uruchomiony pomyślnie."
  exit 0
fi

echo "Błąd: nie udało się uruchomić Docker."
exit 1
