$FrontendDir  = Join-Path $PSScriptRoot "frontend"
$GITHUB_REPO  = "MrunalGhorpade13/De-Bachat-Stellar"

# ─── Step 1: Install Vercel CLI ───────────────────────────────────────────────
Write-Host ""
Write-Host "==> [1/4] Installing Vercel CLI in frontend..." -ForegroundColor Cyan
Push-Location $FrontendDir
$null = npm install --save-dev vercel@latest 2>&1
Write-Host "    [OK] Vercel CLI installed" -ForegroundColor Green
$vercelBin = Join-Path $FrontendDir "node_modules\.bin\vercel.cmd"
Pop-Location

# ─── Step 2: Get Vercel Token ─────────────────────────────────────────────────
Write-Host ""
Write-Host "==> [2/4] Vercel Token" -ForegroundColor Cyan
Write-Host "    1. Open  https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "    2. Click 'Create Token', name it 'github-actions', set No Expiry" -ForegroundColor White
Write-Host "    3. Copy the generated token" -ForegroundColor White
Write-Host ""
$VERCEL_TOKEN     = Read-Host "    Paste Vercel Token"
$env:VERCEL_TOKEN = $VERCEL_TOKEN

# ─── Step 3: Link project and get IDs ────────────────────────────────────────
Write-Host ""
Write-Host "==> [3/4] Linking Vercel project..." -ForegroundColor Cyan
Push-Location $FrontendDir
$linkOut = & $vercelBin link --yes --token=$VERCEL_TOKEN 2>&1
$linkOut | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
Pop-Location

$projectJsonPath = Join-Path $FrontendDir ".vercel\project.json"
if (-not (Test-Path $projectJsonPath)) {
    Write-Host "    [ERROR] .vercel/project.json not found. Link may have failed." -ForegroundColor Red
    Write-Host "    Try running 'vercel link' manually in .\frontend"
    exit 1
}

$pj                = Get-Content $projectJsonPath -Raw | ConvertFrom-Json
$VERCEL_ORG_ID     = $pj.orgId
$VERCEL_PROJECT_ID = $pj.projectId

Write-Host "    [OK] VERCEL_ORG_ID     = $VERCEL_ORG_ID" -ForegroundColor Green
Write-Host "    [OK] VERCEL_PROJECT_ID = $VERCEL_PROJECT_ID" -ForegroundColor Green

# ─── Step 4: Set GitHub Secrets ──────────────────────────────────────────────
Write-Host ""
Write-Host "==> [4/4] Setting GitHub Actions secrets..." -ForegroundColor Cyan
Write-Host "    GitHub PAT needed (classic, 'repo' scope)." -ForegroundColor White
Write-Host "    Create at: https://github.com/settings/tokens/new" -ForegroundColor White
Write-Host ""
$GITHUB_PAT = Read-Host "    Paste GitHub PAT"

$authHeaders = @{
    "Authorization"        = "Bearer $GITHUB_PAT"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

# Get repo public key
try {
    $pk    = Invoke-RestMethod "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/public-key" -Headers $authHeaders
    $pkKey = $pk.key
    $pkId  = $pk.key_id
    Write-Host "    [OK] Repo public key fetched (id: $pkId)" -ForegroundColor Green
}
catch {
    Write-Host "    [ERROR] Could not fetch public key: $_" -ForegroundColor Red
    Write-Host "    Make sure the PAT has 'repo' scope and is valid."
    exit 1
}

# Write encryption helper (tweetsodium)
$encFile = Join-Path $env:TEMP "gh_encrypt.cjs"
@"
const sodium = require('tweetsodium');
const [pubKey, secret] = process.argv.slice(2);
const key = Buffer.from(pubKey, 'base64');
const val = Buffer.from(secret, 'utf8');
const enc = sodium.seal(val, key);
process.stdout.write(Buffer.from(enc).toString('base64'));
"@ | Set-Content $encFile -Encoding UTF8

# Install tweetsodium in TEMP
Push-Location $env:TEMP
$null = npm install tweetsodium 2>&1
Pop-Location

function Set-GithubSecret($name, $value) {
    $enc  = node $encFile $pkKey $value
    $body = @{ encrypted_value = $enc; key_id = $pkId } | ConvertTo-Json -Compress
    try {
        $null = Invoke-RestMethod `
            -Uri "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/$name" `
            -Headers $authHeaders -Method Put -Body $body -ContentType "application/json"
        Write-Host "    [OK] Secret '$name' set" -ForegroundColor Green
    }
    catch {
        Write-Host "    [ERROR] Failed to set '$name': $_" -ForegroundColor Red
    }
}

Set-GithubSecret "VERCEL_TOKEN"      $VERCEL_TOKEN
Set-GithubSecret "VERCEL_ORG_ID"     $VERCEL_ORG_ID
Set-GithubSecret "VERCEL_PROJECT_ID" $VERCEL_PROJECT_ID

# ─── Trigger deployment ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "==> Pushing empty commit to trigger GitHub Actions..." -ForegroundColor Cyan
Push-Location $PSScriptRoot
git commit --allow-empty -m "ci: trigger deploy after secrets configured"
git push origin main
Pop-Location

Write-Host ""
Write-Host "SUCCESS! Monitor your deployment at:" -ForegroundColor Green
Write-Host "  https://github.com/$GITHUB_REPO/actions" -ForegroundColor Green
