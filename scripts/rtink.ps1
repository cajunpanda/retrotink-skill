# rtink launcher for Windows (called by rtink.cmd). Uses Node.js 18+ if installed; otherwise downloads the
# official portable Node.js LTS zip from nodejs.org once (checked against its published SHA-256) into
# %LOCALAPPDATA%\retrotink and uses that. Nothing is installed system-wide; no admin rights needed.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$line = if ($env:RTINK_NODE_LINE) { $env:RTINK_NODE_LINE } else { 'latest-v22.x' }
$cache = if ($env:RTINK_CACHE) { $env:RTINK_CACHE } else { Join-Path $env:LOCALAPPDATA 'retrotink' }

function Test-Node($exe) {
  try { $v = & $exe -p "process.versions.node.split('.')[0]" 2>$null; return ([int]$v -ge 18) } catch { return $false }
}

$node = $null
$sys = Get-Command node -ErrorAction SilentlyContinue
if ($sys -and (Test-Node $sys.Source)) { $node = $sys.Source }
if (-not $node -and (Test-Path (Join-Path $cache 'node'))) {
  Get-ChildItem (Join-Path $cache 'node') -Directory | ForEach-Object {
    $exe = Join-Path $_.FullName 'node.exe'
    if ((Test-Path $exe) -and (Test-Node $exe)) { $node = $exe }
  }
}

if (-not $node) {
  $arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
  $base = "https://nodejs.org/dist/$line"
  [Console]::Error.WriteLine('Node.js not found: downloading a private copy (one time, ~30 MB) from nodejs.org...')
  $tmp = Join-Path ([IO.Path]::GetTempPath()) ("rtink-" + [guid]::NewGuid())
  New-Item -ItemType Directory -Path $tmp | Out-Null
  try {
    $sums = (Invoke-WebRequest -UseBasicParsing "$base/SHASUMS256.txt").Content
    $m = [regex]::Match($sums, "([0-9a-f]{64})\s+(node-v[0-9.]+-win-$arch\.zip)")
    if (-not $m.Success) { throw "no Node.js build for win-$arch in $base" }
    $file = $m.Groups[2].Value
    $zip = Join-Path $tmp $file
    Invoke-WebRequest -UseBasicParsing "$base/$file" -OutFile $zip
    if ((Get-FileHash $zip -Algorithm SHA256).Hash.ToLower() -ne $m.Groups[1].Value) { throw 'Node.js download failed its checksum; not using it' }
    New-Item -ItemType Directory -Force -Path (Join-Path $cache 'node') | Out-Null
    Expand-Archive -Path $zip -DestinationPath (Join-Path $cache 'node') -Force
    $node = Join-Path (Join-Path (Join-Path $cache 'node') ($file -replace '\.zip$', '')) 'node.exe'
    [Console]::Error.WriteLine("Node.js ready: $node")
  } finally { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
}

& $node (Join-Path $here 'rtink.mjs') @args
exit $LASTEXITCODE
