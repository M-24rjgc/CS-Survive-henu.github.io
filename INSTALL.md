# Windows 环境安装指南

## 🎯 完整安装步骤

### 1. 安装 Ruby

#### 方法一：使用 RubyInstaller（推荐）
1. 访问 [RubyInstaller 官网](https://rubyinstaller.org/)
2. 下载 **Ruby+Devkit 3.1.x (x64)** 版本
3. 运行安装程序，默认安装即可
4. 在安装结束时，选择运行 `ridk install` 来安装 MSYS2

#### 方法二：使用 Chocolatey
如果你已经安装了 Chocolatey：
```powershell
# 以管理员身份运行 PowerShell
choco install ruby -y
```

#### 方法三：使用 Scoop
如果你使用 Scoop：
```powershell
scoop install ruby
```

### 2. 验证安装

打开新的 PowerShell 窗口，运行：
```powershell
ruby --version
gem --version
```

应该显示类似：
```
ruby 3.1.0p0 (2021-12-25 revision fb4df44d16) [x64-mingw32]
3.3.3
```

### 3. 安装 Jekyll 和 Bundler

```powershell
# 安装 Jekyll 和 Bundler
gem install jekyll bundler

# 验证安装
jekyll --version
bundle --version
```

### 4. 安装项目依赖

在项目根目录中运行：
```powershell
# 确保在项目目录中
cd E:\CS-Survive-henu.github.io

# 安装项目依赖
bundle install
```

### 5. 启动本地服务器

```powershell
# 启动开发服务器
bundle exec jekyll serve --watch --incremental

# 或者使用我们的脚本
.\deploy.bat dev
```

然后在浏览器中访问 `http://localhost:4000`

## 🐛 常见问题解决

### 问题 1: 编码错误
**症状**: 出现 `Invalid byte sequence in GBK` 错误
**解决方案**:
```powershell
# 设置环境变量
$env:LANG = "en_US.UTF-8"
$env:LC_ALL = "en_US.UTF-8"
```

### 问题 2: 端口占用
**症状**: 4000 端口被占用
**解决方案**:
```powershell
# 使用其他端口
bundle exec jekyll serve --port 4001
```

### 问题 3: 权限问题
**症状**: 提示权限不足
**解决方案**:
- 以管理员身份运行 PowerShell
- 或者使用 `--user-install` 参数安装 gem

### 问题 4: SSL 证书问题
**症状**: SSL 证书验证失败
**解决方案**:
```powershell
# 临时解决方案
gem install --source http://rubygems.org/ bundler

# 永久解决方案
gem sources --remove https://rubygems.org/
gem sources --add http://rubygems.org/
```

## 🚀 一键安装脚本

创建一个名为 `install.ps1` 的文件：

```powershell
# 检查是否已安装 Ruby
if (!(Get-Command ruby -ErrorAction SilentlyContinue)) {
    Write-Host "Ruby 未安装，请先安装 Ruby" -ForegroundColor Red
    Write-Host "访问 https://rubyinstaller.org/ 下载并安装" -ForegroundColor Yellow
    exit 1
}

# 安装 Jekyll 和 Bundler
Write-Host "安装 Jekyll 和 Bundler..." -ForegroundColor Green
gem install jekyll bundler

# 安装项目依赖
Write-Host "安装项目依赖..." -ForegroundColor Green
bundle install

Write-Host "安装完成！" -ForegroundColor Green
Write-Host "运行以下命令启动开发服务器:" -ForegroundColor Yellow
Write-Host "  bundle exec jekyll serve --watch --incremental" -ForegroundColor Cyan
Write-Host "  或者运行: .\deploy.bat dev" -ForegroundColor Cyan
```

运行脚本：
```powershell
# 如果遇到执行策略问题，先运行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 然后运行安装脚本
.\install.ps1
```

## 🔧 开发工具推荐

### 代码编辑器
- **VS Code**: 推荐安装以下扩展
  - Jekyll Syntax Support
  - Markdown All in One
  - Live Server

### 浏览器扩展
- **Chrome DevTools**: 调试网站
- **React Developer Tools**: 如果使用 React

### Git 工具
- **Git for Windows**: 基本 Git 功能
- **GitHub Desktop**: 图形化 Git 客户端

## 📚 学习资源

### Jekyll 官方资源
- [Jekyll 官方文档](https://jekyllrb.com/)
- [Jekyll 主题](https://jekyllthemes.io/)

### Markdown 语法
- [Markdown 基础语法](https://www.markdownguide.org/basic-syntax/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

### 前端技术
- [HTML/CSS 基础](https://www.w3schools.com/)
- [JavaScript 基础](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎉 快速开始

如果你急于开始，可以按照这个简化流程：

1. **安装 Ruby**: 访问 https://rubyinstaller.org/ 下载安装
2. **打开 PowerShell**: 在项目目录中
3. **运行命令**:
   ```powershell
   gem install jekyll bundler
   bundle install
   bundle exec jekyll serve
   ```
4. **访问网站**: 打开 http://localhost:4000

## 🆘 寻求帮助

如果安装过程中遇到问题：
1. 查看错误信息并搜索解决方案
2. 在 GitHub Issues 中提问
3. 联系项目维护者

---

*祝你安装成功！Happy Coding! 🚀*
