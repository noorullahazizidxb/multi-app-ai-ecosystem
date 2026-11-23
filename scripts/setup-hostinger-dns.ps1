# ============================================================================
# Hostinger DNS Automation Script for devminds.net
# Unified Multi-App AI Ecosystem (Web + API Subdomains)
# ============================================================================

param(
    [string]$HostingerApiToken = $env:HOSTINGER_API_TOKEN,
    [string]$VpsIpAddress = "127.0.0.1",
    [string]$Domain = "devminds.net"
)

$HostingerExe = "$env:LOCALAPPDATA\Programs\hostinger\hostinger.exe"
if (-not (Test-Path $HostingerExe)) {
    $HostingerExe = "hostinger"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Unified Multi-App AI Ecosystem — Hostinger DNS Setup    " -ForegroundColor Cyan
Write-Host "  Domain: $Domain                                         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check or set API Token
if ($HostingerApiToken) {
    Write-Host "[✓] Applying Hostinger API Token..." -ForegroundColor Green
    & $HostingerExe config set api_token $HostingerApiToken
} else {
    Write-Host "[i] No HOSTINGER_API_TOKEN passed in arguments or environment." -ForegroundColor Yellow
    Write-Host "    If you have a token, run: hostinger config set api_token <YOUR_TOKEN>" -ForegroundColor Yellow
}

# 2. DNS Records Specification
$DnsRecords = @(
    # Web Frontends (Vercel CNAME Records)
    @{ Type = "CNAME"; Name = "careerforge"; Target = "e85bb6690192ca1a.vercel-dns-017.com."; App = "CareerForge AI Web" },
    @{ Type = "CNAME"; Name = "kinetic";     Target = "aab76a1198f44605.vercel-dns-017.com."; App = "KineticAI Web" },
    @{ Type = "CNAME"; Name = "freelanceos"; Target = "e0aa6d87eda890b7.vercel-dns-017.com."; App = "FreelanceOS Web" },
    @{ Type = "CNAME"; Name = "viralmatrix"; Target = "a41cda6e12580850.vercel-dns-017.com."; App = "ViralMatrix AI Web" },

    # Isolated API Backends (VPS Docker Ports 4001-4004 via Nginx Reverse Proxy)
    @{ Type = "A"; Name = "api-careerforge"; Target = $VpsIpAddress; App = "CareerForge AI Backend (:4001)" },
    @{ Type = "A"; Name = "api-kinetic";     Target = $VpsIpAddress; App = "KineticAI Backend (:4002)" },
    @{ Type = "A"; Name = "api-freelanceos"; Target = $VpsIpAddress; App = "FreelanceOS Backend (:4003)" },
    @{ Type = "A"; Name = "api-viralmatrix"; Target = $VpsIpAddress; App = "ViralMatrix AI Backend (:4004)" }
)

Write-Host "`nTarget Subdomains to Configure in Hostinger ($Domain):" -ForegroundColor White
$DnsRecords | Format-Table -Property Name, Type, Target, App -AutoSize

Write-Host "`nHostinger CLI Commands Generated for devminds.net:" -ForegroundColor Green

foreach ($rec in $DnsRecords) {
    $fullSubdomain = "$($rec.Name).$Domain"
    Write-Host "# Record for $($rec.App) -> $fullSubdomain" -ForegroundColor DarkGray
    if ($rec.Type -eq "CNAME") {
        Write-Host "hostinger dns records update --domain $Domain --record-type CNAME --name $($rec.Name) --target $($rec.Target) --ttl 14400 --yes" -ForegroundColor Cyan
    } else {
        Write-Host "hostinger dns records update --domain $Domain --record-type A --name $($rec.Name) --target $($rec.Target) --ttl 14400 --yes" -ForegroundColor Cyan
    }
}

Write-Host "`nTo execute these directly using your Hostinger API Token:" -ForegroundColor Yellow
Write-Host "  1. Generate token in Hostinger: Account -> API Tokens" -ForegroundColor White
Write-Host "  2. Run: .\scripts\setup-hostinger-dns.ps1 -HostingerApiToken '<YOUR_TOKEN>' -VpsIpAddress '<YOUR_VPS_IP>'" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
