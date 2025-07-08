@echo off
echo 🚀 准备推送 VitePress 网站到 GitHub...
echo.

REM 检查是否有更改
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 不在 Git 仓库中
    pause
    exit /b 1
)

REM 显示当前状态
echo 📋 当前更改状态：
git status --short

echo.
echo 🔄 添加所有更改...
git add .

echo.
echo 📝 提交更改...
set /p commit_message="请输入提交信息 (默认: 更新网站内容): "
if "%commit_message%"=="" set commit_message=更新网站内容

git commit -m "%commit_message%"

echo.
echo 🚀 推送到 GitHub...
git push origin main

echo.
echo ✅ 推送完成！
echo.
echo � 重要提醒：
echo    - package-lock.json 已重新生成以确保依赖同步
echo    - GitHub Actions 现在使用 npm install 而不是 npm ci
echo    - 这样可以避免依赖版本冲突问题
echo.
echo �🌐 GitHub Actions 将自动构建和部署网站
echo 📱 你可以在以下位置查看部署状态：
echo    https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/actions
echo.
echo 🎯 网站将在几分钟后在以下地址更新：
echo    https://cs-survive-henu.github.io
echo.
echo 💡 如果部署失败，请检查 GitHub Actions 日志
echo.
pause
