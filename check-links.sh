#!/bin/bash
# 修复所有可能的死链接问题

echo "🔍 搜索所有可能的死链接..."

# 在整个 docs 目录中查找相对链接
find docs -name "*.md" -exec grep -l "\]\(\.\./\|\./" {} \;

echo ""
echo "📋 检查具体的链接内容..."

# 查找所有相对链接
find docs -name "*.md" -exec grep -H "\]\(\.\./\|\./" {} \;

echo ""
echo "✅ 搜索完成"
