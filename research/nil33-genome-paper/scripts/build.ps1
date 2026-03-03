# NIL33 Genome Paper - PDF Build Script
# Assembles sections into a single Markdown, then builds PDF via Pandoc + LaTeX

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$paperRoot = Resolve-Path (Join-Path $scriptDir "..") | Select-Object -ExpandProperty Path
$paperDir  = Join-Path $paperRoot "paper"
$distDir   = Join-Path $paperRoot "dist"
$refDir    = Join-Path $paperRoot "references"
$tplDir    = Join-Path $paperRoot "templates"

Write-Host ""
Write-Host "NIL33 Genome Paper - PDF Build" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "[1] Checking prerequisites..."

# Pandoc
if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "  ERROR: Pandoc not found." -ForegroundColor Red
    Write-Host "  Install from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    Write-Host "  Windows: winget install JohnMacFarlane.Pandoc" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
$pandocVersion = pandoc --version | Select-Object -First 1
Write-Host "  Pandoc: $pandocVersion" -ForegroundColor Green

# LaTeX engine
$latexEngine = $null
if (Get-Command pdflatex -ErrorAction SilentlyContinue) {
    $latexEngine = "pdflatex"
} elseif (Get-Command xelatex -ErrorAction SilentlyContinue) {
    $latexEngine = "xelatex"
}

if (-not $latexEngine) {
    Write-Host ""
    Write-Host "  ERROR: No LaTeX engine found. Install pdflatex or xelatex." -ForegroundColor Red
    Write-Host "  Install MiKTeX from: https://miktex.org/download" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Write-Host "  LaTeX engine: $latexEngine" -ForegroundColor Green

# Ensure dist directory
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

# Assemble sections
Write-Host ""
Write-Host "[2] Assembling sections..."

$sectionsDir = Join-Path $paperDir "sections"
$mainMd      = Join-Path $paperDir "main.md"
$assembledMd = Join-Path $distDir "assembled.md"

# Read main.md for YAML front matter
$mainContent = Get-Content $mainMd -Raw -Encoding UTF8
$yamlMatch = [regex]::Match($mainContent, '(?s)^---\r?\n(.+?)\r?\n---')
$yamlFrontMatter = ""
if ($yamlMatch.Success) {
    $yamlFrontMatter = $yamlMatch.Value
}

$sectionFiles = @(
    "00-abstract.md",
    "01-introduction.md",
    "02-background.md",
    "03-methodology-genome.md",
    "04-scoring-and-grades.md",
    "05-covenants-and-riskflags.md",
    "06-stress-and-var.md",
    "07-lifecycle-integration.md",
    "08-portfolio-genome-analytics.md",
    "09-reproducibility.md",
    "10-limitations-future.md"
)

$nl = [Environment]::NewLine
$assembled = $yamlFrontMatter + $nl + $nl

foreach ($file in $sectionFiles) {
    $filepath = Join-Path $sectionsDir $file
    if (Test-Path $filepath) {
        $content = Get-Content $filepath -Raw -Encoding UTF8
        $assembled += $content + $nl + $nl
        Write-Host "  + $file" -ForegroundColor DarkGray
    } else {
        Write-Host "  ! MISSING: $file" -ForegroundColor Red
    }
}

# Add references
$assembled += "## References" + $nl + $nl + "::: {#refs}" + $nl + ":::" + $nl + $nl + "\newpage" + $nl + $nl

# Add appendix
$appendixFile = Join-Path $sectionsDir "11-appendix-api.md"
if (Test-Path $appendixFile) {
    $appendixContent = Get-Content $appendixFile -Raw -Encoding UTF8
    $assembled += $appendixContent + $nl + $nl
    Write-Host "  + 11-appendix-api.md" -ForegroundColor DarkGray
}

# Write assembled file
[System.IO.File]::WriteAllText($assembledMd, $assembled, [System.Text.UTF8Encoding]::new($false))
Write-Host "  Assembled: $assembledMd" -ForegroundColor Green

# Build PDF
Write-Host ""
Write-Host "[3] Building PDF..."

$outputPdf    = Join-Path $distDir "NIL33_Genome_v1_0.pdf"
$bibFile      = Join-Path $refDir "references.bib"
$templateFile = Join-Path $tplDir "nil33.latex"

$pdfEngineArg = "--pdf-engine=" + $latexEngine
$outputArg    = "--output=" + $outputPdf

$pandocArgs = [System.Collections.ArrayList]@()
[void]$pandocArgs.Add($assembledMd)
[void]$pandocArgs.Add($pdfEngineArg)
[void]$pandocArgs.Add("--from=markdown+yaml_metadata_block+tex_math_dollars+pipe_tables+fenced_code_blocks+inline_code_attributes")
[void]$pandocArgs.Add("--to=pdf")
[void]$pandocArgs.Add($outputArg)
[void]$pandocArgs.Add("--number-sections")
[void]$pandocArgs.Add("--toc")
[void]$pandocArgs.Add("--toc-depth=3")
[void]$pandocArgs.Add("--variable=documentclass:article")
[void]$pandocArgs.Add("--variable=classoption:11pt")
[void]$pandocArgs.Add("--variable=classoption:letterpaper")
[void]$pandocArgs.Add("--variable=geometry:margin=1in")

if (Test-Path $bibFile) {
    $bibArg = "--bibliography=" + $bibFile
    [void]$pandocArgs.Add($bibArg)
    [void]$pandocArgs.Add("--citeproc")
    Write-Host "  Bibliography: $bibFile" -ForegroundColor DarkGray
}

if (Test-Path $templateFile) {
    $tplArg = "--template=" + $templateFile
    [void]$pandocArgs.Add($tplArg)
    Write-Host "  Template: $templateFile" -ForegroundColor DarkGray
}

Write-Host "  Output: $outputPdf" -ForegroundColor DarkGray
Write-Host "  Engine: $latexEngine" -ForegroundColor DarkGray
Write-Host ""

try {
    $argsArray = $pandocArgs.ToArray()
    & pandoc $argsArray 2>&1 | ForEach-Object {
        $line = $_.ToString()
        if ($line -match "error|Error|ERROR") {
            Write-Host "  $line" -ForegroundColor Red
        } elseif ($line -match "warn|Warn|WARN") {
            Write-Host "  $line" -ForegroundColor Yellow
        } else {
            Write-Host "  $line" -ForegroundColor DarkGray
        }
    }

    if (Test-Path $outputPdf) {
        $size = (Get-Item $outputPdf).Length
        $sizeKB = [math]::Round($size / 1024, 1)
        Write-Host ""
        Write-Host "  PDF generated successfully!" -ForegroundColor Green
        Write-Host "  File: $outputPdf" -ForegroundColor Green
        Write-Host "  Size: $sizeKB KB" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  ERROR: PDF was not generated." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "  ERROR: Pandoc build failed." -ForegroundColor Red
    Write-Host ("  " + $_.Exception.Message) -ForegroundColor Red
    exit 1
}

Write-Host ""
