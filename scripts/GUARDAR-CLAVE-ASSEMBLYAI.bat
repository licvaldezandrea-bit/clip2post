@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0guardar-clave.ps1" ASSEMBLYAI_API_KEY
pause

