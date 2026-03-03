# ──────────────────────────────────────────────────────────────
# NIL33 Genome Paper — Artifact Export Script
# Generates JSON artifacts and synthetic CSV from @nil33/core
# ──────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot  = Resolve-Path (Join-Path $scriptDir "..\..\..") | Select-Object -ExpandProperty Path
$paperRoot = Resolve-Path (Join-Path $scriptDir "..") | Select-Object -ExpandProperty Path

Write-Host ""
Write-Host "NIL33 Genome Paper — Artifact Export" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# ─── Check prerequisites ─────────────────────────────────────
Write-Host "[1] Checking prerequisites..."

# Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ERROR: Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeVersion = (node --version)
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

# tsx
$tsxPath = Join-Path $repoRoot "node_modules/.bin/tsx"
$hasTsx = (Get-Command tsx -ErrorAction SilentlyContinue) -or (Test-Path $tsxPath)

if (-not $hasTsx) {
    Write-Host "  tsx not found, checking for ts-node..." -ForegroundColor Yellow
    $tsNodePath = Join-Path $repoRoot "node_modules/.bin/ts-node"
    $hasTsNode = (Get-Command ts-node -ErrorAction SilentlyContinue) -or (Test-Path $tsNodePath)

    if (-not $hasTsNode) {
        Write-Host "  Installing tsx locally..." -ForegroundColor Yellow
        Push-Location $repoRoot
        npm install --save-dev tsx 2>&1 | Out-Null
        Pop-Location
    }
}

# ─── Build nil33-core if needed ──────────────────────────────
Write-Host ""
Write-Host "[2] Ensuring @nil33/core is built..."

$coreDir = Join-Path $repoRoot "packages\nil33-core"
$distDir = Join-Path $coreDir "dist"

if (-not (Test-Path (Join-Path $distDir "index.js"))) {
    Write-Host "  Building @nil33/core..." -ForegroundColor Yellow
    Push-Location $coreDir
    npm run build
    Pop-Location
}
Write-Host "  @nil33/core: built" -ForegroundColor Green

# ─── Run export ──────────────────────────────────────────────
Write-Host ""
Write-Host "[3] Running artifact export..."

$exportScript = Join-Path $scriptDir "export-artifacts.ts"

Push-Location $repoRoot
try {
    npx tsx $exportScript
} catch {
    Write-Host ""
    Write-Host "  ERROR: Artifact export failed." -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# ─── Verify outputs ─────────────────────────────────────────
Write-Host ""
Write-Host "[4] Verifying artifacts..."

$artifacts = @(
    "example-research-snapshot.json",
    "example-replay-record.json",
    "example-portfolio-genome-metrics.json",
    "synthetic-data.csv"
)

$artifactsDir = Join-Path $paperRoot "artifacts"
$allOk = $true

foreach ($file in $artifacts) {
    $filepath = Join-Path $artifactsDir $file
    if (Test-Path $filepath) {
        $size = (Get-Item $filepath).Length
        Write-Host "  OK  $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  MISSING  $file" -ForegroundColor Red
        $allOk = $false
    }
}

if ($allOk) {
    Write-Host ""
    Write-Host "All artifacts exported successfully." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Some artifacts are missing. Check the output above." -ForegroundColor Red
    exit 1
}

Write-Host ""
