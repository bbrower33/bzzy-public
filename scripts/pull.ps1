# Powershell command to effectively pull changes
# to be ready to edit files.
#
# Brian Brower
# 10/05/2026
# 2026 © Bzzy

Write-Host "--- Starting Git Pull ---" -ForegroundColor Cyan

# Optional: Check if there are uncommitted local changes that might block the pull
$localChanges = git status --porcelain
if (-not [string]::IsNullOrWhitespace($localChanges)) {
    Write-Host "Warning: You have uncommitted local changes." -ForegroundColor Yellow
    $response = Read-Host -Prompt "Do you want to stash these changes before pulling? (y/n)"
    if ($response -eq 'y') {
        Write-Host "Stashing local changes..." -ForegroundColor Yellow
        git stash
        $stashed = $true
    } else {
        Write-Host "Proceeding with pull without stashing (conflicts may occur)..." -ForegroundColor Yellow
    }
}

# Pull latest changes from main
Write-Host "Pulling latest changes from origin/main..." -ForegroundColor Yellow
git pull origin main

# Restore stashed changes if they were stashed earlier
if ($stashed) {
    Write-Host "Restoring stashed changes..." -ForegroundColor Yellow
    git stash pop
}

Write-Host "--- Git Pull Completed Successfully! ---" -ForegroundColor Green