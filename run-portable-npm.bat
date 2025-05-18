@echo off
echo Setting up portable Node.js environment...
set NODEJS_PATH=%~dp0nodejs-portable\node-v20.11.1-win-x64
set PATH=%NODEJS_PATH%;%PATH%

echo Node.js path: %NODEJS_PATH%

echo Running: npm %*
"%NODEJS_PATH%\npm.cmd" %*
