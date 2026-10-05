# Powershell command to effectively push changes to the correct branch
# of the repository for ease of use.
#
# Brian Brower
# 10/05/2026
# 2026 © Bzzy

Set-Location .

$FilesToStage = @(
    "./"
)

Write-Host "--- Starting Git Push ---" -ForegroundColor Cyan

Write-Host "Staging specified files..." -ForegroundColor Yellow
foreach ($pattern in $FilesToStage) {
    git add $pattern
}


$stagedChanges = git diff --name-only --cached
if ([string]::IsNullOrWhitespace($stagedChanges)) {
    Write-Host "No changes were staged. Exiting script." -ForegroundColor Red
    exit
}


Write-Host "Committing changes with message: '$Message'..." -ForegroundColor Yellow
git commit -m $Message


Write-Host "Pushing changes to main branch..." -ForegroundColor Yellow
git push

Write-Host "--- Git Workflow Completed Successfully! ---" -ForegroundColor Green