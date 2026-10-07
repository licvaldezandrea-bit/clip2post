@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0guardar-clave.ps1" NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
pause

