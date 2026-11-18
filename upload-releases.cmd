@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "BASH="
if exist "%ProgramFiles%\Git\bin\bash.exe" set "BASH=%ProgramFiles%\Git\bin\bash.exe"
if not defined BASH if exist "%ProgramFiles(x86)%\Git\bin\bash.exe" set "BASH=%ProgramFiles(x86)%\Git\bin\bash.exe"
if not defined BASH for /f "delims=" %%i in ('where bash 2^>nul') do if not defined BASH set "BASH=%%i"
if not defined BASH (
  echo 找不到 Git Bash，请先安装 Git for Windows 再运行本脚本。
  pause
  exit /b 1
)

echo ==========================================================
echo   Token 背单词工坊 - 把所有历史 APK 传到 GitHub Releases
echo   仓库：https://github.com/YJH9999/EN_learn
echo ==========================================================
echo.
echo  需要的令牌：GitHub 右上角头像 - Settings - Developer settings
echo               - Personal access tokens - Fine-grained tokens
echo               仓库只勾 YJH9999/EN_learn，权限 Contents: Read and write
echo.
echo  已经发布过的版本会自动跳过，可以随时重复运行。
echo.
set "TOKEN="
set /p "TOKEN=把令牌粘贴到这里再按回车（内容会显示在屏幕上）："
if not defined TOKEN (
  echo.
  echo 没有输入令牌，已取消。
  pause
  exit /b 1
)

echo.
set "GITHUB_TOKEN=%TOKEN%"
"%BASH%" "tools/upload-releases.sh"
echo.
pause
