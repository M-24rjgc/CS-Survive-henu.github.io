@echo off
REM 测试构建脚本 (Windows版本)

echo 🏗️ 开始构建 VitePress 项目...

REM 安装依赖
echo 📦 安装依赖...
npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 构建项目...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 检查构建结果
if exist "docs\.vitepress\dist" (
    echo ✅ 构建成功！输出目录：docs\.vitepress\dist
    
    REM 创建 .nojekyll 文件
    echo. > docs\.vitepress\dist\.nojekyll
    echo ✅ 已创建 .nojekyll 文件
    
    REM 显示构建结果
    echo 📊 构建结果：
    dir docs\.vitepress\dist
) else (
    echo ❌ 构建失败：找不到输出目录
    pause
    exit /b 1
)

echo 🎉 构建完成！
pause
