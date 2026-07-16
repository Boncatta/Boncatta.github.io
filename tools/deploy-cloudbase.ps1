param(
  [Parameter(Mandatory = $true)]
  [string]$EnvId,

  [string]$ServiceName = "boncatta-api",
  [int]$Port = 8787
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$tcb = Join-Path $env:APPDATA "npm\tcb.cmd"

if (!(Test-Path $tcb)) {
  throw "CloudBase CLI not found. Run: npm install -g @cloudbase/cli --registry=https://registry.npmmirror.com"
}

Push-Location $root
try {
  & $tcb cloudrun deploy `
    --env-id $EnvId `
    --serviceName $ServiceName `
    --port $Port `
    --source . `
    --installDependency true `
    --force
} finally {
  Pop-Location
}
