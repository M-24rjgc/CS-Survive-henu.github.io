@echo off
rem 河南大学计算机生存指北 - VitePress 部署脚本
rem 使用说明：
rem 1. 本地开发: deploy-vitepress.bat dev
rem 2. 构建网站: deploy-vitepress.bat build  
rem 3. 预览构建: deploy-vitepress.bat preview
rem 4. 部署到GitHub Pages: deploy-vitepress.bat deploy

if "%1"=="dev" (
    echo 🚀 启动本地开发服务器...
    echo 📝 如果是第一次运行，请先执行: deploy-vitepress.bat install
    echo 🌐 服务器将在 http://localhost:5173 启动
    npm run dev
    goto :EOF
)

if "%1"=="build" (
    echo 🏗️  构建静态网站...
    npm run build
    echo ✅ 构建完成！文件在 docs/.vitepress/dist 目录中
    goto :EOF
)

if "%1"=="preview" (
    echo 👀 预览构建后的网站...
    npm run preview
    echo 🌐 预览服务器将在 http://localhost:4173 启动
    goto :EOF
)

if "%1"=="deploy" (
    echo 🚀 部署到 GitHub Pages...
    echo 📝 确保你已经push到main分支
    echo ⚠️  GitHub Actions将自动部署网站
    git add .
    git commit -m "Update content - %date% %time%"
    git push origin main
    echo ✅ 推送完成！请在 GitHub Actions 中查看部署状态
    goto :EOF
)

if "%1"=="install" (
    echo 📦 安装依赖...
    npm install
    echo ✅ 依赖安装完成！
    goto :EOF
)

if "%1"=="clean" (
    echo 🧹 清理缓存...
    rmdir /s /q docs\.vitepress\dist
    rmdir /s /q docs\.vitepress\cache
    echo ✅ 清理完成！
    goto :EOF
)

echo 河南大学计算机生存指北 - VitePress 部署脚本
echo.
echo 用法: %0 [命令]
echo.
echo 命令:
echo   install  安装依赖
echo   dev      启动本地开发服务器
echo   build    构建静态网站
echo   preview  预览构建后的网站
echo   deploy   部署到GitHub Pages
echo   clean    清理缓存
echo.
echo 示例:
echo   %0 install  # 首次运行需要安装依赖
echo   %0 dev      # 本地开发
echo   %0 deploy   # 部署到GitHub Pages
