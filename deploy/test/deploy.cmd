@echo off
setlocal

REM =====================================================
REM Resolve repo root (../.. from deploy\test)
REM =====================================================
set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%..\..

REM Normalize path
pushd %REPO_ROOT%

REM =====================================================
REM CONFIG
REM =====================================================
set PROJECT_PATH=src\BadmintonApp.API\BadmintonApp.API.csproj
set PUBLISH_DIR=deploy\test\publish
set SERVER=root@46.224.53.52
set REMOTE_DIR=/opt/apps/badmik/publish
set CONTAINER_NAME=badmik-api

REM =====================================================
REM BUILD
REM =====================================================
echo === Publishing Badmik API (TEST) ===
dotnet publish %PROJECT_PATH% -c Release -o %PUBLISH_DIR%
IF ERRORLEVEL 1 (
    echo Publish failed
    popd
    exit /b 1
)

REM =====================================================
REM CLEAN REMOTE (MINIMAL ADD)
REM =====================================================
echo === Cleaning remote publish folder ===
ssh %SERVER% "rm -rf %REMOTE_DIR%/*"
IF ERRORLEVEL 1 (
    echo Remote clean failed
    popd
    exit /b 1
)

REM =====================================================
REM COPY
REM =====================================================
echo === Copying publish to server ===
scp -r %PUBLISH_DIR%\* %SERVER%:%REMOTE_DIR%
IF ERRORLEVEL 1 (
    echo SCP failed
    popd
    exit /b 1
)

REM =====================================================
REM RESTART CONTAINER (MINIMAL ADD)
REM =====================================================
echo === Restarting API container ===
ssh %SERVER% "docker restart %CONTAINER_NAME%"
IF ERRORLEVEL 1 (
    echo Container restart failed
    popd
    exit /b 1
)

popd
echo === DONE: Test deploy finished successfully ===
pause