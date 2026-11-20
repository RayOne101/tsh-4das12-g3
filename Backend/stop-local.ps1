# Script PowerShell pour arrêter les services locaux TSH
# Utilisation :
#   .\stop-local.ps1          # Arrête Eureka, User et Gateway
#   .\stop-local.ps1 -Infra   # Arrête aussi les conteneurs Docker
param(
    [switch]$Infra
)

$BackendDir = $PSScriptRoot
Set-Location $BackendDir

$PidDir = Join-Path $BackendDir "logs\pids"

function Stop-PidFile([string]$file) {
    if (-not (Test-Path $file)) { return }
    $pidToKill = (Get-Content $file -Raw).Trim()
    $name = [System.IO.Path]::GetFileNameWithoutExtension($file)
    if ($pidToKill) {
        try {
            Stop-Process -Id ([int]$pidToKill) -Force -ErrorAction SilentlyContinue
            Write-Host "  $name arrete (PID $pidToKill)" -ForegroundColor Yellow
        } catch {
            Write-Host "  $name deja arrete" -ForegroundColor DarkGray
        }
    }
    Remove-Item $file -Force -ErrorAction SilentlyContinue
}

Write-Host "Arret des services Spring..." -ForegroundColor Cyan
foreach ($svc in @("gateway", "user", "eureka")) {
    $pidPath = Join-Path $PidDir "$svc.pid"
    Stop-PidFile $pidPath
}

if ($Infra) {
    Write-Host "Arret des conteneurs Docker..." -ForegroundColor Cyan
    $composeFile = Join-Path $BackendDir "docker-compose.yml"
    docker compose -f $composeFile down
    Write-Host "Conteneurs arretes." -ForegroundColor Yellow
}
