REM =====================================================
REM RESTART POSTGRES (auto-detect container by name)
REM =====================================================
set SERVER=root@46.224.53.52
set POSTGRES_CONTAINER_NAME=infra-postgres

echo === Restarting Postgres container(s) by filter ===
echo === Restarting Postgres container === ssh %SERVER% "docker restart %POSTGRES_CONTAINER_NAME%"
IF ERRORLEVEL 1 (
    echo Postgres container restart failed
    popd
    exit /b 1
)