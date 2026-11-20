# Script PowerShell pour démarrer la pile locale TSH sous Windows
# Utilisation :
#   .\start-local.ps1          # Démarre les conteneurs et les services
#   .\start-local.ps1 -Build   # Reconstruit les JARs avant de démarrer
param(
    [switch]$Build
)

$ErrorActionPreference = "Stop"
$BackendDir = $PSScriptRoot
Set-Location $BackendDir

$LogDir = Join-Path $BackendDir "logs"
$PidDir = Join-Path $LogDir "pids"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }
if (-not (Test-Path $PidDir)) { New-Item -ItemType Directory -Path $PidDir | Out-Null }

function Test-PortOpen([int]$port) {
    try {
        $conn = New-Object System.Net.Sockets.TcpClient
        $asyncResult = $conn.BeginConnect("127.0.0.1", $port, $null, $null)
        $wait = $asyncResult.AsyncWaitHandle.WaitOne(1000, $false)
        if ($wait) {
            $conn.EndConnect($asyncResult)
            $conn.Close()
            return $true
        }
        $conn.Close()
        return $false
    } catch {
        return $false
    }
}

function Wait-ForService([string]$label, [int]$port, [int]$timeoutSeconds) {
    Write-Host "  Attente de $label sur le port $port..." -ForegroundColor Yellow
    $elapsed = 0
    while ($elapsed -lt $timeoutSeconds) {
        if (Test-PortOpen $port) {
            Write-Host "  [OK] $label est pret sur le port $port" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    Write-Host "  [ATTENTION] $label ne repond pas apres $timeoutSeconds s" -ForegroundColor Red
    return $false
}

function Start-SpringService([string]$name, [int]$port, [string]$jarPath) {
    if (Test-PortOpen $port) {
        Write-Host "  $name est deja en cours d'execution sur le port $port" -ForegroundColor Cyan
        return
    }
    if (-not (Test-Path $jarPath)) {
        Write-Error "Fichier JAR introuvable : $jarPath. Relancez avec -Build."
        return
    }
    Write-Host "  Demarrage de $name..." -ForegroundColor Cyan
    $logFile = Join-Path $LogDir "$name.log"
    $process = Start-Process -FilePath "java" -ArgumentList "-jar", "`"$jarPath`"" -RedirectStandardOutput $logFile -RedirectStandardError $logFile -PassThru
    Set-Content -Path (Join-Path $PidDir "$name.pid") -Value $process.Id
    Wait-ForService $name $port 90 | Out-Null
}

# 1. Conteneurs Docker
Write-Host "`n[1/3] Demarrage des conteneurs (PostgreSQL, pgweb, Keycloak, MinIO)..." -ForegroundColor Cyan
$composeFile = Join-Path $BackendDir "docker-compose.yml"
docker compose -f $composeFile up -d
Wait-ForService "Keycloak" 8085 60 | Out-Null

# 2. Build optionnel
if ($Build) {
    Write-Host "`n[Build] Compilation des microservices..." -ForegroundColor Cyan
    $mvn = "mvn"
    # Fallback to local embedded maven if mvn not in PATH
    $localMvn = Join-Path (Split-Path $BackendDir) ".freebuff\tools\apache-maven-3.9.9\bin\mvn.cmd"
    if (Test-Path $localMvn) { $mvn = $localMvn }
    & $mvn clean package -DskipTests
}

# 3. Services Spring
Write-Host "`n[2/3] Demarrage d'Eureka Discovery (port 8761)..." -ForegroundColor Cyan
$eurekaJar = Join-Path $BackendDir "infrastructure\Eureka\target\eureka-server-0.0.1-SNAPSHOT.jar"
Start-SpringService "eureka" 8761 $eurekaJar

Write-Host "`n[3/3] Demarrage de User Service (port 8762) et Gateway (port 8083)..." -ForegroundColor Cyan
$userJar = Join-Path $BackendDir "microservices\User\target\User-0.0.1-SNAPSHOT.jar"
Start-SpringService "user" 8762 $userJar

$gatewayJar = Join-Path $BackendDir "infrastructure\Gateway\target\gateway-0.0.1-SNAPSHOT.jar"
Start-SpringService "gateway" 8083 $gatewayJar

Write-Host "`n=== Tous les services backend sont prets ! ===" -ForegroundColor Green
Write-Host "  Eureka   : http://localhost:8761"
Write-Host "  Gateway  : http://localhost:8083"
Write-Host "  Keycloak : http://localhost:8085"
Write-Host "  MinIO    : http://localhost:9001 (console)"
Write-Host "  Logs     : $LogDir`n"
