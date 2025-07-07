# Node.js 环境设置问题解决指南

## 问题描述
如果在运行 `setup.bat` 时出现 "Node.js 未安装或未添加到PATH环境变量" 的错误，请按照以下步骤解决：

## 解决方案

### 1. 确认 Node.js 已正确安装

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装最新的 LTS 版本
3. 在安装过程中，确保勾选了 "Add to PATH" 选项

### 2. 验证安装

安装完成后，请：
1. **重启终端** 或命令提示符
2. 打开新的 PowerShell 或 CMD 窗口
3. 运行以下命令验证：
   ```bash
   node --version
   npm --version
   ```

### 3. 手动添加到 PATH (如果需要)

如果仍然无法识别 node 命令：

1. 找到 Node.js 安装目录（通常是 `C:\Program Files\nodejs\`）
2. 右键点击 "此电脑" → "属性" → "高级系统设置"
3. 点击 "环境变量"
4. 在 "系统变量" 中找到 `Path` 变量，点击 "编辑"
5. 点击 "新建"，添加 Node.js 安装目录
6. 点击 "确定" 保存
7. **重启终端** 或重新登录系统

### 4. 重新运行设置脚本

完成上述步骤后，重新运行：
```bash
.\setup.bat
```

## GitHub Actions 问题解决

如果在 GitHub Actions 中出现 "Dependencies lock file is not found" 错误，这已经通过以下方式解决：

1. 已创建了 `package-lock.json` 文件
2. 已更新 GitHub Actions 配置，将 `npm ci` 改为 `npm install`

## 联系支持

如果问题仍然存在，请：
1. 检查 Node.js 版本是否为 18.x 或更高版本
2. 确保系统已重启
3. 在项目 Issues 中报告问题
