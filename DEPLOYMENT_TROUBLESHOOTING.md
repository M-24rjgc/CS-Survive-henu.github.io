# 🔧 GitHub Actions 部署故障排除指南

## 🎯 常见问题及解决方案

### 1. ❌ npm ci 错误：package-lock.json 不同步

**错误信息：**
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

**解决方案：**
✅ 已修复！现在使用 `npm install` 替代 `npm ci`

### 2. ❌ Jekyll 构建错误

**错误信息：**
```
Could not locate Gemfile
gem install bundler
```

**解决方案：**
✅ 已修复！删除了所有 Jekyll 相关的工作流

### 3. ❌ 权限错误

**错误信息：**
```
Error: Resource not accessible by integration
```

**解决方案：**
1. 进入 GitHub 仓库设置
2. 点击 Settings → Pages
3. 确保 Source 设置为 "GitHub Actions"
4. 确保 Actions 权限正确

### 4. ❌ 构建失败：找不到文件

**错误信息：**
```
ENOENT: no such file or directory
```

**解决方案：**
检查以下文件是否存在：
- `docs/.vitepress/config.mjs`
- `docs/index.md`
- `package.json`

### 5. ❌ 网站显示 404

**可能原因：**
- base 路径配置错误
- 文件路径不匹配
- 部署目录错误

**解决方案：**
1. 检查 `docs/.vitepress/config.mjs` 中的 `base` 设置
2. 确保所有链接路径正确
3. 检查 GitHub Pages 设置

## 🚀 部署检查清单

### 部署前检查：
- [ ] 本地构建成功：`npm run build`
- [ ] 所有文件已提交
- [ ] package.json 和 package-lock.json 同步

### 部署后检查：
- [ ] GitHub Actions 构建成功
- [ ] 网站可以正常访问
- [ ] 所有页面链接正常
- [ ] 样式和图片正常加载

## 🔍 调试步骤

### 1. 检查 GitHub Actions 日志
```
https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/actions
```

### 2. 本地测试构建
```bash
npm run build
npm run preview
```

### 3. 检查构建输出
```bash
ls -la docs/.vitepress/dist/
```

### 4. 验证配置文件
```bash
node -e "console.log(JSON.stringify(require('./docs/.vitepress/config.mjs'), null, 2))"
```

## 📞 获取帮助

如果问题仍然存在：

1. **查看日志**：检查 GitHub Actions 的详细日志
2. **本地测试**：确保本地构建和预览正常
3. **检查配置**：对比工作的 VitePress 项目配置
4. **重新部署**：删除 .github/workflows 目录，重新创建

## 🎯 最佳实践

1. **定期更新依赖**
   ```bash
   npm update
   ```

2. **使用锁定文件**
   - 提交 package-lock.json
   - 确保团队使用相同的依赖版本

3. **测试驱动部署**
   - 每次部署前本地测试
   - 使用 staging 分支进行测试

4. **监控部署状态**
   - 设置 GitHub Actions 通知
   - 定期检查网站状态

---

**💡 提示：大多数部署问题都可以通过重新生成 package-lock.json 解决！**
