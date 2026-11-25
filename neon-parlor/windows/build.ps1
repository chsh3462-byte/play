param([string]$Python="py",[string]$Destination="dist")
$ErrorActionPreference="Stop"
$project=(Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dest=[IO.Path]::GetFullPath($Destination)
& $Python (Join-Path $project "tools/package.py") $dest
if ($LASTEXITCODE) { throw "Offline bundle failed" }
$tempBuild=Join-Path ([IO.Path]::GetTempPath()) ("neon-build-"+[Guid]::NewGuid())
New-Item -ItemType Directory -Path $tempBuild | Out-Null
& $Python -m PyInstaller --noconfirm --clean --onefile --windowed --name NeonParlor --icon (Join-Path $PSScriptRoot "salon.ico") --add-data ((Join-Path $dest "game.html")+";.") --distpath $dest --workpath $tempBuild --specpath $tempBuild (Join-Path $project "python/main.py")
if ($LASTEXITCODE) { throw "Windows build failed" }
