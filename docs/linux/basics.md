# Linux基础

Linux基础知识和入门指南

## 🐧 Linux发行版介绍

### 主流发行版
- **Ubuntu**：最受欢迎的桌面Linux发行版
- **CentOS/RHEL**：企业级服务器发行版
- **Debian**：稳定可靠的发行版
- **Fedora**：前沿技术的试验场
- **Arch Linux**：高度可定制的发行版

### 选择建议
- **初学者**：Ubuntu LTS 或 Linux Mint
- **服务器**：CentOS/RHEL 或 Ubuntu Server
- **开发者**：Fedora 或 Ubuntu
- **高级用户**：Arch Linux 或 Gentoo

## 🖥️ 系统安装

### 安装方式
1. **虚拟机安装**
   - VirtualBox（免费）
   - VMware（商业）
   - Hyper-V（Windows）

2. **双系统安装**
   - 硬盘分区准备
   - 引导器配置
   - 系统安装

3. **WSL安装**
   - Windows Subsystem for Linux
   - WSL2 推荐

### 系统配置
- 用户账户设置
- 网络配置
- 软件源配置
- 基本软件安装

## 🏗️ 文件系统结构

### 根文件系统
```
/
├── bin/     # 基本命令
├── boot/    # 启动文件
├── dev/     # 设备文件
├── etc/     # 配置文件
├── home/    # 用户目录
├── lib/     # 系统库
├── media/   # 可移动媒体
├── mnt/     # 挂载点
├── opt/     # 可选软件
├── proc/    # 进程信息
├── root/    # root用户目录
├── sbin/    # 系统命令
├── sys/     # 系统信息
├── tmp/     # 临时文件
├── usr/     # 用户程序
└── var/     # 变量数据
```

### 重要目录说明
- `/etc/`：系统配置文件
- `/home/`：用户家目录
- `/var/log/`：日志文件
- `/usr/local/`：本地安装的软件

## 🔧 桌面环境

### 常见桌面环境
- **GNOME**：现代简洁的桌面环境
- **KDE Plasma**：功能丰富的桌面环境
- **XFCE**：轻量级桌面环境
- **Cinnamon**：传统风格的桌面环境

### 桌面环境选择
- **新手用户**：GNOME 或 Cinnamon
- **低配置设备**：XFCE 或 LXDE
- **高度定制**：KDE Plasma

## 📝 基本概念

### 用户和权限
- 用户类型：root用户、普通用户
- 权限系统：读、写、执行
- sudo命令：临时提权

### 进程管理
- 进程状态：运行、就绪、阻塞
- 进程查看：ps、top、htop
- 进程控制：kill、killall

### 包管理
- **APT**：Debian/Ubuntu系统
- **YUM/DNF**：RHEL/CentOS/Fedora系统
- **Pacman**：Arch Linux系统

## 🎯 下一步

学习完基础知识后，建议继续学习：
- [Linux命令](/linux/commands/)
- [Linux学习笔记](/linux/notes/)
- 系统管理和运维
- [Shell脚本编程](/linux/scripting.html)

## 📚 推荐资源

### 书籍
- 《鸟哥的Linux私房菜》
- 《Linux命令行大全》
- 《Linux系统管理技术手册》

### 在线资源
- Linux官方文档
- Ubuntu官方教程
- LinuxCommand.org
- 实验楼Linux课程

记住，学习Linux最重要的是多实践，多尝试！
