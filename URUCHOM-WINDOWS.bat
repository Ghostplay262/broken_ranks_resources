@echo off
cd /d "%~dp0"
py -3 uruchom.py
if errorlevel 1 echo Install Python 3 with the Python Launcher, or run: python uruchom.py
pause
