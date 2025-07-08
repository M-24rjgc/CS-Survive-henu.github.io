@echo off
echo 🧹 清理旧的 Jekyll 文件...

REM 删除 Jekyll 配置文件
if exist "_config.yml" (
    del "_config.yml"
    echo ✅ 删除 _config.yml
)

REM 删除 Gemfile
if exist "Gemfile" (
    del "Gemfile"
    echo ✅ 删除 Gemfile
)

if exist "Gemfile.lock" (
    del "Gemfile.lock"
    echo ✅ 删除 Gemfile.lock
)

REM 删除 Jekyll 布局目录
if exist "_layouts" (
    rmdir /s /q "_layouts"
    echo ✅ 删除 _layouts 目录
)

REM 删除 Jekyll 构建目录
if exist "_site" (
    rmdir /s /q "_site"
    echo ✅ 删除 _site 目录
)

REM 删除 Jekyll 数据目录
if exist "_data" (
    rmdir /s /q "_data"
    echo ✅ 删除 _data 目录
)

REM 删除 Jekyll 包含目录
if exist "_includes" (
    rmdir /s /q "_includes"
    echo ✅ 删除 _includes 目录
)

REM 删除 Jekyll Sass 目录
if exist "_sass" (
    rmdir /s /q "_sass"
    echo ✅ 删除 _sass 目录
)

REM 删除旧的 Jekyll 工作流
if exist ".github\workflows\jekyll.yml" (
    del ".github\workflows\jekyll.yml"
    echo ✅ 删除 Jekyll 工作流
)

if exist ".github\workflows\static.yml" (
    del ".github\workflows\static.yml"
    echo ✅ 删除 static 工作流
)

if exist ".github\workflows\deploy.yml" (
    del ".github\workflows\deploy.yml"
    echo ✅ 删除 deploy 工作流
)

REM 删除旧的部署脚本
if exist "deploy.bat" (
    del "deploy.bat"
    echo ✅ 删除旧的 deploy.bat
)

if exist "deploy.sh" (
    del "deploy.sh"
    echo ✅ 删除旧的 deploy.sh
)

if exist "setup.bat" (
    del "setup.bat"
    echo ✅ 删除旧的 setup.bat
)

if exist "setup.sh" (
    del "setup.sh"
    echo ✅ 删除旧的 setup.sh
)

if exist "test-build.bat" (
    del "test-build.bat"
    echo ✅ 删除旧的 test-build.bat
)

if exist "test-build.sh" (
    del "test-build.sh"
    echo ✅ 删除旧的 test-build.sh
)

echo.
echo 🎉 清理完成！现在你的项目已经是纯 VitePress 项目了。
echo.
echo 下一步：
echo 1. 运行 npm install 安装依赖
echo 2. 运行 npm run dev 启动开发服务器
echo 3. 运行 npm run build 构建项目
echo 4. 提交代码到 GitHub 触发自动部署
echo.
pause
