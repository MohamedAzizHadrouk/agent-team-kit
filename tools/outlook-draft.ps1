<#
.SYNOPSIS
  Creates an email DRAFT in the local Outlook desktop app (Windows). It NEVER sends.
  Works with any account configured in Outlook (Exchange on-premises, Microsoft 365, IMAP…), no password needed.

.DESCRIPTION
  Used by the Project Lead to prepare notification emails (task assigned, review request, changes requested,
  approved). The draft lands in the Drafts folder of the default Outlook account; the owner reviews and clicks Send.

.PARAMETER To        One or more recipient addresses (comma-separated string or array).
.PARAMETER Cc        Optional CC addresses.
.PARAMETER Subject   Email subject.
.PARAMETER BodyFile  Path to an HTML (.html) or plain-text (.txt / .md) file with the body.
.PARAMETER Display   Also open the draft window on screen.
.PARAMETER DryRun    Check Outlook is reachable and print what would be created – saves NOTHING.

.EXAMPLE
  powershell -NoProfile -File tools/outlook-draft.ps1 -To "someone@company.com" -Subject "Nouvelle tâche" -BodyFile body.html
#>
param(
  [Parameter(Mandatory = $true)] [string[]] $To,
  [string[]] $Cc = @(),
  [Parameter(Mandatory = $true)] [string] $Subject,
  [Parameter(Mandatory = $true)] [string] $BodyFile,
  [switch] $Display,
  [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $BodyFile)) { throw "Body file not found: $BodyFile" }
$body = Get-Content -LiteralPath $BodyFile -Raw -Encoding UTF8
$isHtml = $BodyFile -match '\.html?$'

$toList = ($To | ForEach-Object { $_ -split '[,;]' } | ForEach-Object { $_.Trim() } | Where-Object { $_ }) -join '; '
$ccList = ($Cc | ForEach-Object { $_ -split '[,;]' } | ForEach-Object { $_.Trim() } | Where-Object { $_ }) -join '; '

foreach ($addr in ($toList + '; ' + $ccList) -split '; ') {
  if ($addr -and $addr -notmatch '^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$') { throw "Not a valid email address: '$addr'" }
}

try {
  $outlook = New-Object -ComObject Outlook.Application
} catch {
  throw "Outlook desktop is not available on this computer (COM object Outlook.Application). $_"
}

if ($DryRun) {
  Write-Output "DRY RUN – Outlook reachable. Would create draft:"
  Write-Output "  To:      $toList"
  if ($ccList) { Write-Output "  Cc:      $ccList" }
  Write-Output "  Subject: $Subject"
  Write-Output "  Format:  $(if ($isHtml) { 'HTML' } else { 'text' }) ($($body.Length) chars)"
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($outlook) | Out-Null
  exit 0
}

$mail = $outlook.CreateItem(0)   # 0 = olMailItem
$mail.To = $toList
if ($ccList) { $mail.CC = $ccList }
$mail.Subject = $Subject
if ($isHtml) { $mail.HTMLBody = $body } else { $mail.Body = $body }
$mail.Save()                      # saved to Drafts – NOT sent
if ($Display) { $mail.Display() }

Write-Output "DRAFT CREATED in Outlook Drafts (not sent)."
Write-Output "  To:      $toList"
if ($ccList) { Write-Output "  Cc:      $ccList" }
Write-Output "  Subject: $Subject"

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($mail) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($outlook) | Out-Null
