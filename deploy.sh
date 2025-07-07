#!/bin/bash

# 河南大学计算机生存指北 - 部署脚本
# 使用说明：
# 1. 本地开发: ./deploy.sh dev
# 2. 构建网站: ./deploy.sh build  
# 3. 部署到GitHub Pages: ./deploy.sh deploy

set -e

case "$1" in
    "dev")
        echo "🚀 启动本地开发服务器..."
        echo "📝 如果是第一次运行，请先执行: bundle install"
        echo "🌐 服务器将在 http://localhost:4000 启动"
        bundle exec jekyll serve --watch --incremental
        ;;
    
    "build")
        echo "🏗️  构建静态网站..."
        bundle exec jekyll build
        echo "✅ 构建完成！文件在 _site 目录中"
        ;;
    
    "deploy")
        echo "🚀 部署到 GitHub Pages..."
        echo "📝 确保你已经push到main分支"
        echo "⚠️  GitHub Actions将自动部署网站"
        git add .
        git commit -m "Update content - $(date '+%Y-%m-%d %H:%M:%S')"
        git push origin main
        echo "✅ 推送完成！请在 GitHub Actions 中查看部署状态"
        ;;
    
    "install")
        echo "📦 安装依赖..."
        gem install bundler
        bundle install
        echo "✅ 依赖安装完成！"
        ;;
    
    "clean")
        echo "🧹 清理缓存..."
        bundle exec jekyll clean
        echo "✅ 清理完成！"
        ;;
    
    *)
        echo "河南大学计算机生存指北 - 部署脚本"
        echo ""
        echo "用法: $0 [命令]"
        echo ""
        echo "命令:"
        echo "  install  安装依赖"
        echo "  dev      启动本地开发服务器"
        echo "  build    构建静态网站"
        echo "  deploy   部署到GitHub Pages"
        echo "  clean    清理缓存"
        echo ""
        echo "示例:"
        echo "  $0 install  # 首次运行需要安装依赖"
        echo "  $0 dev      # 本地开发"
        echo "  $0 deploy   # 部署到GitHub Pages"
        ;;
esac
