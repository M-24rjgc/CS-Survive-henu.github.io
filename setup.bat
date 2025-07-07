@echo off
REM 河南大学计算机生存指北 - Windows快速设置脚本
REM 此脚本用于快速设置VitePress开发环境

echo 🚀 河南大学计算机生存指北 - 环境设置
echo ==========================================

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装
    echo 请先安装npm
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version

echo ✅ npm 版本:
npm --version

REM 安装依赖
echo.
echo 📦 正在安装依赖...
npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装完成

REM 启动开发服务器
echo.
echo 🚀 启动开发服务器...
echo 请在浏览器中访问: http://localhost:5173
echo 按 Ctrl+C 停止服务器
echo.

npm run dev

pause
