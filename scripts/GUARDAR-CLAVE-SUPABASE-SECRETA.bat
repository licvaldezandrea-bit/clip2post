@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0guardar-clave.ps1" SUPABASE_SECRET_KEY
pause

