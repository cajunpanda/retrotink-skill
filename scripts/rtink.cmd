@echo off
rem rtink launcher for Windows: runs rtink.ps1 with the built-in Windows PowerShell (no install needed).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rtink.ps1" %*
exit /b %ERRORLEVEL%
