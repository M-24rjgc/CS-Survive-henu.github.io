#!/bin/bash

# 河南大学计算机生存指北 - 快速设置脚本
# 此脚本用于快速设置VitePress开发环境

echo "🚀 河南大学计算机生存指北 - 环境设置"
echo "=========================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    echo "请先安装npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 正在安装依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装完成"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 启动开发服务器
echo ""
echo "🚀 启动开发服务器..."
echo "请在浏览器中访问: http://localhost:5173"
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
