#!/bin/bash
# 测试构建脚本

echo "🏗️ 开始构建 VitePress 项目..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "docs/.vitepress/dist" ]; then
    echo "✅ 构建成功！输出目录：docs/.vitepress/dist"
    
    # 创建 .nojekyll 文件
    touch docs/.vitepress/dist/.nojekyll
    echo "✅ 已创建 .nojekyll 文件"
    
    # 显示构建结果
    echo "📊 构建结果："
    ls -la docs/.vitepress/dist/
else
    echo "❌ 构建失败：找不到输出目录"
    exit 1
fi

echo "🎉 构建完成！"
