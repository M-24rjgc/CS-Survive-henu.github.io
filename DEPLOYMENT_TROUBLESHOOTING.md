# 🔧 GitHub Actions 部署故障排除指南

## 🎯 常见问题及解决方案

### 1. ❌ Rollup 模块找不到错误

**错误信息：**
```
Cannot find module @rollup/rollup-linux-x64-gnu
```

**解决方案：**
✅ 已修复！工作流现在包含多种回退方案：
1. 首先尝试 `npm ci`（最快最可靠）
2. 如果失败，使用 `npm install --no-optional`
3. 最后回退到 `npm install --force`

### 2. ❌ npm ci 错误：package-lock.json 不同步

**错误信息：**
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

**解决方案：**
✅ 已修复！工作流会自动检测并处理这个问题

### 3. ❌ Jekyll 构建错误

**错误信息：**
```
Could not locate Gemfile
gem install bundler
```

**解决方案：**
✅ 已修复！删除了所有 Jekyll 相关的工作流

### 4. ❌ 权限错误

**错误信息：**
```
Error: Resource not accessible by integration
```

**解决方案：**
1. 进入 GitHub 仓库设置
2. 点击 Settings → Pages
3. 确保 Source 设置为 "GitHub Actions"
4. 确保 Actions 权限正确

### 5. ❌ 构建失败：找不到文件

**错误信息：**
```
ENOENT: no such file or directory
```

**解决方案：**
检查以下文件是否存在：
- `docs/.vitepress/config.ts`
- `docs/index.md`
- `package.json`

### 7. ❌ Azure Static Web Apps 部署失败

**错误信息：**
```
Build failed - no build output found
Unable to find build artifacts
```

**解决方案：**
✅ 已修复！Azure 工作流现在包含完整的 VitePress 构建流程：
1. Node.js 环境设置
2. 自动依赖安装
3. VitePress 构建过程
4. 正确的输出目录配置 (`docs/.vitepress/dist`)

### 8. ❌ Azure 与 GitHub Pages 部署冲突

**症状：** 两个部署工作流同时运行导致资源竞争

**解决方案：**
✅ 已优化！两个部署流程现在可以并行工作：
- GitHub Pages 部署：用于主要站点托管
- Azure Static Web Apps：用于 CDN 加速和全球分发
- 两者使用相同的 VitePress 构建流程，确保一致性

**可能原因：**
- base 路径配置错误
- 文件路径不匹配
- 部署目录错误

**解决方案：**
1. 检查 `docs/.vitepress/config.ts` 中的 `base` 设置
2. 确保所有链接路径正确
3. 检查 GitHub Pages 设置

## 🛠️ 新的部署流程特点

### 🔄 多重回退机制
1. **第一选择**：`npm ci` - 最快最可靠
2. **第二选择**：`npm install --no-optional` - 跳过可选依赖
3. **最后选择**：`npm install --force` - 强制安装

### � 详细日志输出
- 显示安装过程的每个步骤
- 列出已安装的包
- 显示构建输出文件

### 🔧 自动修复
- 自动创建 `.nojekyll` 文件
- 自动复制静态资源
- 自动处理依赖冲突

## �🚀 部署检查清单

### 部署前检查：
- [ ] 本地构建成功：`npm run build`
- [ ] 所有文件已提交
- [ ] VitePress 版本兼容

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
# 清理环境
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install

# 测试构建
npm run build
npm run preview
```

### 3. 检查构建输出
```bash
ls -la docs/.vitepress/dist/
```

### 4. 验证配置文件
```bash
node -e "console.log(JSON.stringify(require('./docs/.vitepress/config.ts'), null, 2))"
```

## 📞 获取帮助

如果问题仍然存在：

1. **查看日志**：检查 GitHub Actions 的详细日志
2. **本地测试**：确保本地构建和预览正常
3. **检查配置**：对比工作的 VitePress 项目配置
4. **重新部署**：使用 "Re-run all jobs" 重新运行工作流

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

## 📈 性能优化建议

1. **缓存策略**
   - 使用 GitHub Actions 缓存
   - 优化 npm 安装速度

2. **构建优化**
   - 使用 `--prefer-offline` 标志
   - 跳过不必要的可选依赖

3. **错误处理**
   - 多重回退机制
   - 详细的错误日志

---

**💡 提示：新的部署流程已经大大提高了稳定性和可靠性！**
