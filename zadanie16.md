Różnice: backup-db.sh vs backup-db.ps1
Ogólne
Aspekt	Bash (Linux)	PowerShell (Windows)
System
Linux / WSL / Git Bash
Windows (natywnie)
Uruchomienie
./backup-db.sh (po chmod +x)
.\backup-db.ps1
Shebang
#!/bin/bash
brak (uruchamia PowerShell)
Katalog backupu
/var/backups/db
C:\var\backups\db
Ścieżki
/
\ + Join-Path
Składnia i zmienne
Bash	PowerShell
DB_NAME="app_database"
$DB_NAME = 'app_database'
$(date +%Y%m%d_%H%M%S)
Get-Date -Format 'yyyyMMdd_HHmmss'
"${BACKUP_DIR}/plik"
Join-Path $BACKUP_DIR "plik"
echo "tekst"
Write-Host "tekst"
Katalog i błędy
Bash	PowerShell
[ ! -d "$BACKUP_DIR" ]
-not (Test-Path ... -PathType Container)
mkdir -p
New-Item -ItemType Directory -Force
if [ $? -eq 0 ] po komendzie
try { ... } catch { ... }
$? = kod ostatniej komendy
$ErrorActionPreference = 'Stop' + catch
Backup i kompresja (największa różnica)
Bash	PowerShell
Jedna linia: mysqldump ... | gzip > plik.gz
Dwa kroki: dump → .sql, potem kompresja → .gz
Wymaga gzip w systemie
Kompresja przez .NET (GZipStream) — bez gzip.exe
Strumień: od razu do .sql.gz
Plik tymczasowy .sql, potem usunięcie
Bash:

mysqldump -u root -p "$DB_NAME" | gzip > "$FILENAME"
PowerShell: mysqldump → Out-File → GZipStream → Remove-Item pliku .sql.

Zachowanie przy błędzie
Bash	PowerShell
Komunikat ogólny: „Błąd podczas backupu”
catch pokazuje szczegóły: $_
Brak sprzątania po błędzie
Usuwa częściowy .sql, jeśli istnieje
Wymagania
Bash	PowerShell
bash, mysqldump, gzip
PowerShell 5.1+, mysqldump w PATH
Typowo w /usr/bin
np. C:\Program Files\MySQL\...\bin
Podsumowanie: Logika jest ta sama (katalog → dump → skompresowany plik z datą), ale bash robi wszystko w jednym potoku z gzip, a PowerShell używa osobnego pliku .sql i wbudowanej kompresji .NET, bo na Windows nie ma domyślnie gzip jak na Linuxie. Ścieżki i obsługa błędów są dopasowane do każdego systemu.