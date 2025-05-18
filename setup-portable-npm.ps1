$nodejsPath = Join-Path $PSScriptRoot "nodejs-portable\node-v20.11.1-win-x64"
$env:Path = "$nodejsPath;$env:Path"

Write-Host "Setting up portable Node.js environment..."
Write-Host "Node.js path: $nodejsPath"

# Verify node and npm are accessible
$nodeVersion = & "$nodejsPath\node.exe" --version
$npmVersion = & "$nodejsPath\npm.cmd" --version

Write-Host "Node.js version: $nodeVersion"
Write-Host "npm version: $npmVersion"

# Run the npm command with all arguments passed to this script
$npmArgs = $args
Write-Host "Running: npm $npmArgs"
& "$nodejsPath\npm.cmd" $npmArgs
