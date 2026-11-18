@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === 推送到 https://github.com/YJH9999/EN_learn ===
git add -A
git commit -m "release: %date% %time%"
git push -u origin main
if errorlevel 1 (
  echo.
  echo 推送失败：请确认已登录 GitHub（首次会弹出浏览器登录窗口），或检查网络。
) else (
  echo.
  echo 推送成功。
)
echo.
pause
