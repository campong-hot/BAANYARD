@echo off
setlocal EnableExtensions
cd /d "%~dp0.."

if not defined DEPLOY_USER set "DEPLOY_USER=root"
if not defined DEPLOY_HOST set "DEPLOY_HOST=187.52.120.204"
if not defined DEPLOY_PATH set "DEPLOY_PATH=/opt/baanyard"

set "SSH_KEY_ARGS="
if defined DEPLOY_SSH_KEY set SSH_KEY_ARGS=-i "%DEPLOY_SSH_KEY%"

set "SSH_TARGET=%DEPLOY_USER%@%DEPLOY_HOST%"
set "SSH_BASE=ssh %SSH_KEY_ARGS% -o BatchMode=yes -o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new"
set "SCP_BASE=scp %SSH_KEY_ARGS% -o BatchMode=yes -o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new"

set "TAR=%TEMP%\baanyard-deploy.tar"
if exist "%TAR%" del /q "%TAR%"

echo BAANYARD Docker deploy
echo Target: %SSH_TARGET%:%DEPLOY_PATH%
echo Canonical: https://campong.online/projects/baanyard/
echo.

where ssh >nul 2>&1
if errorlevel 1 (
  echo ERROR: ssh not found. Install OpenSSH Client.
  goto :fail
)
where tar >nul 2>&1
if errorlevel 1 (
  echo ERROR: tar failed to locate tar.exe
  goto :fail
)

echo Creating archive...
tar --exclude=.git --exclude=node_modules --exclude=App/node_modules --exclude=App/dist --exclude=.venv --exclude=.firecrawl --exclude=__pycache__ -cf "%TAR%" .
if errorlevel 1 (
  echo ERROR: tar failed.
  goto :fail
)

echo Copying archive...
%SSH_BASE% %SSH_TARGET% "mkdir -p '%DEPLOY_PATH%'"
if errorlevel 1 (
  echo ERROR: SSH mkdir failed. Use an existing key or set DEPLOY_SSH_KEY. Passwords are not stored in this script.
  goto :fail
)

%SCP_BASE% "%TAR%" %SSH_TARGET%:/tmp/baanyard-deploy.tar
if errorlevel 1 (
  echo ERROR: scp failed.
  goto :fail
)

echo Extracting and docker compose up --build...
%SSH_BASE% %SSH_TARGET% "set -e; tar -xf /tmp/baanyard-deploy.tar -C '%DEPLOY_PATH%'; rm -f /tmp/baanyard-deploy.tar; cd '%DEPLOY_PATH%'; sed -i 's/\r$//' deploy/*.sh; if ! command -v docker >/dev/null 2>&1; then echo 'ERROR: docker is not installed on the server'; exit 1; fi; docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d --build --remove-orphans; sh deploy/install-host-nginx.sh"
if errorlevel 1 (
  echo ERROR: remote deploy failed.
  goto :fail
)

echo.
echo Canonical URL: https://campong.online/projects/baanyard/
echo TLS: host nginx. Container is 127.0.0.1:8502 only.
echo.

if exist "%TAR%" del /q "%TAR%"
if /I not "%~1"=="nopause" pause
endlocal
exit /b 0

:fail
if exist "%TAR%" del /q "%TAR%"
if /I not "%~1"=="nopause" pause
endlocal
exit /b 1
