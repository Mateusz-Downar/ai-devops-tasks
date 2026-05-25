# Prosty skrypt do backupu bazy danych (Windows / PowerShell)

$ErrorActionPreference = 'Stop'

$DB_NAME = 'app_database'
$BACKUP_DIR = 'C:\var\backups\db'
$DATE = Get-Date -Format 'yyyyMMdd_HHmmss'
$FILENAME = Join-Path $BACKUP_DIR "${DB_NAME}_${DATE}.sql.gz"

# Sprawdź, czy katalog istnieje
if (-not (Test-Path -Path $BACKUP_DIR -PathType Container)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
    Write-Host "Utworzono katalog $BACKUP_DIR"
}

# Wykonaj backup (mysqldump musi być w PATH — np. z instalacji MySQL)
Write-Host "Rozpoczynam backup bazy $DB_NAME..."

$sqlFile = Join-Path $BACKUP_DIR "${DB_NAME}_${DATE}.sql"

try {
    # -p bez hasła po spacji = mysqldump poprosi o hasło (jak w bash)
    & mysqldump -u root -p $DB_NAME | Out-File -FilePath $sqlFile -Encoding utf8

    # Kompresja do .gz (natywnie w .NET, bez zewnętrznego gzip)
    $inputStream = [System.IO.File]::OpenRead($sqlFile)
    $outputStream = [System.IO.File]::Create($FILENAME)
    $gzipStream = New-Object System.IO.Compression.GZipStream(
        $outputStream,
        [System.IO.Compression.CompressionMode]::Compress
    )
    $inputStream.CopyTo($gzipStream)
    $gzipStream.Close()
    $outputStream.Close()
    $inputStream.Close()

    Remove-Item -Path $sqlFile -Force

    Write-Host "Backup zakończony sukcesem: $FILENAME"
    exit 0
}
catch {
    Write-Host "Błąd podczas wykonywania backupu: $_"
    if (Test-Path $sqlFile) { Remove-Item -Path $sqlFile -Force -ErrorAction SilentlyContinue }
    exit 1
}
