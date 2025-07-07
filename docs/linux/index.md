# Linux指南

Linux系统学习和使用指南

## 🐧 概述

Linux是一个开源的类Unix操作系统，广泛应用于服务器、开发环境和嵌入式系统。对于计算机科学专业的学生来说，掌握Linux是必不可少的技能。

## 🎯 为什么要学Linux

1. **开发环境**：大多数开发工具和框架都原生支持Linux
2. **服务器运维**：绝大多数服务器都运行Linux系统
3. **云计算**：云服务商主要提供Linux虚拟机
4. **容器技术**：Docker、Kubernetes都基于Linux
5. **开源生态**：丰富的开源软件和工具

## 📚 学习内容

### [Linux基础](./basics)
- Linux发行版介绍
- 系统安装和配置
- 桌面环境使用
- 文件系统结构

### [Linux命令](./commands/)
- 基本命令使用
- 文件和目录操作
- 系统管理命令
- 文本处理工具

### [Linux学习笔记](./notes/)
- 系统原理深入理解
- 高级特性和技巧
- 实践经验总结

## 🚀 快速入门

### 选择发行版
推荐新手入门的发行版：
- **Ubuntu**：用户友好，社区活跃
- **CentOS/RHEL**：企业级应用广泛
- **Debian**：稳定性好，包管理优秀
- **Arch Linux**：滚动更新，自由度高

### 安装方式
1. **虚拟机**：VMware、VirtualBox
2. **双系统**：与Windows共存
3. **WSL**：Windows子系统Linux
4. **云服务器**：阿里云、腾讯云

### 基本操作
```bash
# 查看系统信息
uname -a
cat /etc/os-release

# 文件和目录操作
ls -la
cd /path/to/directory
mkdir new_directory
rm -rf old_directory

# 软件包管理
sudo apt update          # Ubuntu/Debian
sudo yum update          # CentOS/RHEL
sudo pacman -Syu         # Arch Linux
```

## 🛠️ 开发环境配置

### 编程语言环境
```bash
# Python
sudo apt install python3 python3-pip

# Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Java
sudo apt install default-jdk

# C/C++
sudo apt install build-essential
```

### 开发工具
```bash
# Git
sudo apt install git

# Docker
curl -fsSL https://get.docker.com | sh

# VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

## 📖 学习资源

### 在线教程
- [Linux 教程 - 菜鸟教程](https://www.runoob.com/linux/linux-tutorial.html)
- [鸟哥的Linux私房菜](http://cn.linux.vbird.org/)
- [Linux 命令大全](https://www.linuxcool.com/)

### 书籍推荐
- 《鸟哥的Linux私房菜》
- 《Linux命令行与shell脚本编程大全》
- 《深入理解Linux内核》

### 实践平台
- [Linux在线实验室](https://www.shiyanlou.com/)
- [Katacoda Linux终端](https://www.katacoda.com/)
- [OverTheWire](https://overthewire.org/wargames/)

## 🔧 常用工具

### 文本编辑器
- **vim/neovim**：强大的命令行编辑器
- **nano**：简单易用的编辑器
- **emacs**：功能丰富的编辑器

### 系统监控
- **top/htop**：进程监控
- **iotop**：IO监控
- **netstat**：网络监控
- **df/du**：磁盘使用情况

### 网络工具
- **curl/wget**：下载工具
- **ssh**：远程登录
- **scp/rsync**：文件传输
- **tcpdump**：网络抓包

## 📝 实践项目

### 初级项目
1. **搭建个人博客**：使用LAMP/LNMP环境
2. **自动化脚本**：系统监控和日志分析
3. **Web服务器配置**：Apache/Nginx配置

### 中级项目
1. **容器化部署**：Docker应用部署
2. **CI/CD流水线**：Jenkins/GitLab CI
3. **监控系统**：Prometheus + Grafana

### 高级项目
1. **Kubernetes集群**：容器编排
2. **分布式系统**：微服务架构
3. **内核模块开发**：系统级编程

## 💡 学习建议

1. **多动手实践**：理论学习要结合实际操作
2. **善用社区资源**：遇到问题主动寻求帮助
3. **阅读官方文档**：培养查阅文档的习惯
4. **参与开源项目**：贡献代码，学习最佳实践

## 🚨 常见问题

### 权限问题
```bash
# 查看文件权限
ls -l filename

# 修改文件权限
chmod 755 filename

# 修改文件所有者
sudo chown user:group filename
```

### 软件包问题
```bash
# 修复损坏的软件包
sudo apt --fix-broken install

# 清理软件包缓存
sudo apt autoclean
sudo apt autoremove
```

### 网络问题
```bash
# 检查网络连接
ping google.com

# 查看网络接口
ip addr show

# 重启网络服务
sudo systemctl restart networking
```

## 🎓 进阶学习

### 系统管理
- 用户和组管理
- 文件系统管理
- 进程和服务管理
- 网络配置

### 安全加固
- 防火墙配置
- 用户权限控制
- 日志审计
- 系统加密

### 性能优化
- 系统性能调优
- 资源使用优化
- 网络性能优化
- 存储性能优化

## 🤝 社区参与

### 中文社区
- [Linux中国](https://linux.cn/)
- [ChinaUnix](http://www.chinaunix.net/)
- [Ubuntu中文论坛](https://forum.ubuntu.org.cn/)

### 国际社区
- [Reddit r/linux](https://www.reddit.com/r/linux/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/linux)
- [Linux Foundation](https://www.linuxfoundation.org/)

掌握Linux不仅是技术技能的提升，更是打开开源世界大门的钥匙。开始你的Linux之旅吧！
