# deploy-auto.ps1
# Run from repo root. Requires: gh CLI logged in, git configured.
$repo = "METHUNSM001/green-idea-app"
$envFile = "backend\.env"

if (-not (Test-Path $envFile)) { Write-Error "$envFile not found"; exit 1 }

Write-Host "Importing secrets from $envFile into GitHub Secrets for $repo..."
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  if ($line -match '^\s*([^=]+)=(.*)$') {
    $k = $matches[1].Trim()
    $v = $matches[2].Trim()
    if ($v -eq "") { Write-Host "Skipping $k (empty)"; return }
    Write-Host "Setting secret $k..."
    gh secret set $k --body $v --repo $repo
    if ($LASTEXITCODE -ne 0) { Write-Error "Failed to set secret $k"; exit 2 }
  }
}

Write-Host "Triggering Render env setter workflow..."
gh workflow run render_set_env.yml --repo $repo
if ($LASTEXITCODE -ne 0) { Write-Warning "Could not trigger workflow (check gh auth/permissions)." }

Write-Host "Removing $envFile from index and adding to .gitignore..."
git rm --cached $envFile -f 2>$null
if (-not (Select-String -Path .gitignore -Pattern [regex]::Escape($envFile) -Quiet)) {
  Add-Content -Path .gitignore -Value "`n$envFile"
  git add .gitignore
  git commit -m "chore: remove backend/.env from repo and ignore it"
  if ($LASTEXITCODE -ne 0) { Write-Host "No .gitignore changes to commit" }
  else { git push origin HEAD:main }
} else {
  Write-Host "$envFile already in .gitignore"
}

Write-Host "Creating empty commit to trigger Vercel deploy..."
git commit --allow-empty -m "ci: trigger vercel deploy"
git push origin HEAD:main

Write-Host "Done. Monitor runs with: gh run list --repo $repo"