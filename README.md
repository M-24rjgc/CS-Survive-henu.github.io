# 河南大学计算机生存指北 🎓

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://cs-survive-henu.github.io)
[![Jekyll](https://img.shields.io/badge/Jekyll-4.x-red)](https://jekyllrb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/CS-Survive-henu/CS-Survive-henu.github.io)](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/stargazers)

> 由河南大学计算机学院和软件学院的学生/毕业生共同维护的开源生存指南

## 🌟 项目介绍

这是一个为河南大学计算机类专业学生打造的全方位学习指南，涵盖了从新生入学到毕业就业的各个阶段。我们希望通过这个项目，帮助学弟学妹们更好地适应大学生活，提升专业技能，规划未来发展。

### 🎯 主要特色

- 📚 **全面覆盖**：从新生工具到升学就业，内容全面
- 🎓 **实践导向**：真实经验分享，避免纸上谈兵
- 🤝 **社区驱动**：由学生维护，为学生服务
- 📱 **现代化设计**：响应式设计，支持多设备访问
- 🚀 **持续更新**：跟上技术发展，保持内容新鲜

## 📖 内容概览

### 🎯 新生必看
- [**大学开始的地方**](https://cs-survive-henu.github.io/wiki/HCSG-大学开始的地方/) - 这是你开始梦的地方
- [**新生工具箱**](https://cs-survive-henu.github.io/wiki/新生工具箱/) - 必备软件和工具推荐
- [**学会提问**](https://cs-survive-henu.github.io/wiki/学会提问/) - 提问的智慧和技巧

### 🏆 竞赛指南
- [**竞赛指北**](https://cs-survive-henu.github.io/wiki/竞赛指北/) - ACM、CTF等竞赛经验分享
- [**ACM竞赛**](https://cs-survive-henu.github.io/wiki/竞赛指北/#acm竞赛) - 算法竞赛入门与进阶
- [**CTF竞赛**](https://cs-survive-henu.github.io/wiki/竞赛指北/#ctf竞赛) - 信息安全竞赛指导

### 📚 学习资源
- [**AI方向**](https://cs-survive-henu.github.io/wiki/AI方向/) - 人工智能学习路线和资源
- [**Linux基础**](https://cs-survive-henu.github.io/wiki/Linux基础/) - 系统学习指南
- [**如何使用AI**](https://cs-survive-henu.github.io/wiki/如何使用AI/) - AI工具在学习中的应用

### 🎓 升学就业
- [**升学指南**](https://cs-survive-henu.github.io/wiki/升学（保研，考研，or出国）/) - 保研、考研、出国经验分享
- [**实验室选择**](https://cs-survive-henu.github.io/wiki/实验室/) - 科研方向指导
- [**成长思考**](https://cs-survive-henu.github.io/wiki/试着去成为一个有梦想的CS人/) - 计算机专业学生的思考和成长

## 🚀 快速开始

### 在线访问
直接访问我们的网站：**https://cs-survive-henu.github.io**

### 本地开发

#### 环境要求
- Ruby 2.7+
- Jekyll 4.x
- Git

#### 快速部署

**Linux/macOS:**
```bash
# 克隆项目
git clone https://github.com/CS-Survive-henu/CS-Survive-henu.github.io.git
cd CS-Survive-henu.github.io

# 安装依赖
./deploy.sh install

# 启动开发服务器
./deploy.sh dev
```

**Windows:**
```cmd
# 克隆项目
git clone https://github.com/CS-Survive-henu/CS-Survive-henu.github.io.git
cd CS-Survive-henu.github.io

# 安装依赖
deploy.bat install

# 启动开发服务器
deploy.bat dev
```

然后在浏览器中访问 `http://localhost:4000`

#### 手动部署

如果你偏好手动操作：

```bash
# 1. 安装依赖
gem install bundler
bundle install

# 2. 启动开发服务器
bundle exec jekyll serve --watch --incremental

# 3. 构建静态网站
bundle exec jekyll build

# 4. 清理缓存
bundle exec jekyll clean
```

## 🛠️ 技术架构

### 核心技术
- **静态站点生成器**: Jekyll 4.x
- **主题**: Minima (高度定制化)
- **样式**: 自定义CSS + 响应式设计
- **托管**: GitHub Pages
- **自动部署**: GitHub Actions

### 项目结构
```
CS-Survive-henu.github.io/
├── _config.yml              # Jekyll 配置文件
├── _wiki/                   # Wiki 页面集合
│   ├── 新生工具箱.md
│   ├── 竞赛指北.md
│   ├── AI方向.md
│   └── ...
├── _layouts/                # 页面布局
├── _includes/               # 页面组件
├── assets/                  # 静态资源
│   ├── css/
│   │   └── custom.css      # 自定义样式
│   ├── js/
│   └── images/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署
├── index.md                 # 首页
├── about.md                 # 关于页面
├── guides.md                # 导航页面
├── Gemfile                  # Ruby 依赖
├── deploy.sh                # Linux/macOS 部署脚本
├── deploy.bat               # Windows 部署脚本
└── README.md                # 项目说明
```

## 🤝 如何贡献

我们欢迎所有河南大学计算机学院和软件学院的同学参与贡献！

### 贡献方式

#### 📝 内容贡献
- 分享学习经验和心得
- 提供实用工具和资源推荐
- 更新过时的信息和链接
- 添加新的学习方向和内容

#### 🐛 问题反馈
- 报告网站中的错误和问题
- 提出改进建议
- 反馈用户体验问题

#### 💻 技术贡献
- 改进网站设计和用户体验
- 优化网站性能
- 添加新功能
- 修复技术问题

### 贡献流程

1. **Fork 项目**
   ```bash
   # 在GitHub上Fork项目到你的账户
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行修改**
   - 编辑对应的 Markdown 文件
   - 新增内容请放在 `_wiki/` 目录下
   - 遵循现有的文档格式

4. **本地测试**
   ```bash
   ./deploy.sh dev  # 启动本地服务器测试
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "Add: 你的修改描述"
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 详细描述你的修改内容
   - 等待维护者review

### 写作规范

#### Markdown 格式
- 使用标准的 Markdown 语法
- 合理使用标题层级（h1-h6）
- 使用emoji增强可读性 🎉
- 添加合适的链接和引用

#### 内容要求
- 内容准确、实用
- 语言通俗易懂
- 结构清晰、逻辑性强
- 及时更新过时信息

#### 文件命名
- 使用中文文件名（与wiki保持一致）
- 文件名要具有描述性
- 避免使用特殊字符

## 👥 维护团队

### 核心维护者
- **[CSCI](https://github.com/ESP-8266-offical)** - 新生工具箱维护者
- **[Gaolei He](https://github.com/gaolei-he)** - ACM竞赛指导
- **[WesCui](https://github.com/WesCui)** - 升学指导
- **CTF学长** - 信息安全竞赛指导

### 特别感谢
- [ZBW](https://github.com/tuling1900) - 项目支持
- [YM](https://github.com/eqvpkbz) - 项目支持
- [HGL](https://github.com/gaolei-he) - 项目支持

## 📊 项目统计

- 📝 **Wiki页面**: 10+ 个专业指南
- 🎯 **覆盖方向**: 新生指导、竞赛、AI、升学等
- 🤝 **贡献者**: 10+ 位同学参与
- ⭐ **GitHub Stars**: 持续增长中
- 🔄 **更新频率**: 定期更新

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

这意味着你可以：
- ✅ 自由使用、修改、分发
- ✅ 用于商业用途
- ✅ 私人使用

但需要：
- 📄 保留版权声明
- 📄 包含许可证文本

## 🔗 相关链接

- 🌐 **项目官网**: https://cs-survive-henu.github.io
- 📚 **GitHub仓库**: https://github.com/CS-Survive-henu/CS-Survive-henu.github.io
- 📝 **问题反馈**: https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/issues
- 💬 **讨论区**: https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/discussions

## 📞 联系我们

如果你有任何问题或建议，欢迎通过以下方式联系我们：

- 📧 **邮箱**: [创建Issue](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/issues/new)
- 💬 **讨论**: [GitHub Discussions](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/discussions)
- 🐛 **Bug报告**: [提交Issue](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/issues)

## 🎉 加入我们

如果你：
- 🎓 是河南大学计算机学院或软件学院的学生/毕业生
- 💡 有实用的经验和知识想要分享
- 🛠️ 具备一定的技术能力
- ❤️ 愿意为学弟学妹们提供帮助

那么我们非常欢迎你加入我们的维护团队！

---

<div align="center">

**🌟 如果这个项目对你有帮助，请给我们一个 Star！**

**💫 让我们一起为河南大学计算机专业的学生创造更好的学习环境！**

[![Star History Chart](https://api.star-history.com/svg?repos=CS-Survive-henu/CS-Survive-henu.github.io&type=Date)](https://star-history.com/#CS-Survive-henu/CS-Survive-henu.github.io&Date)

</div>

---

*"独学而无友，则孤陋而寡闻。" - 让我们一起学习，一起成长！*

欢迎有AI学习和研究经验的同学参与内容共建。

##  5  [开源社区与贡献](https://github.com/CS-Survive-henu/Henu-Computer-Survival-Guide/wiki/%E5%BC%80%E6%BA%90%E7%A4%BE%E5%8C%BA%E4%B8%8E%E8%B4%A1%E7%8C%AE)

开源社区是计算机技术创新和协作的核心。本部分将介绍：
- 开源精神与常见开源协议
- 如何参与开源项目（如GitHub操作、Issue/PR流程）
- 新手友好的开源项目推荐
- 贡献代码、文档、翻译等多种方式
- 开源社区的职业发展与人脉拓展

鼓励大家积极参与开源，为技术社区做出自己的贡献。

## 6  [学会提问](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/wiki/%E5%AD%A6%E4%BC%9ASTFW%E5%92%8CRTFM)

维护者:[tuling1900](https://github.com/tuling1900)

## 7 [Lab](https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/wiki/%E5%AE%9E%E9%AA%8C%E5%AE%A4)

## Star History

<a href="https://star-history.com/#CS-Survive-henu/Henu-Computer-Survival-Guide&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=CS-Survive-henu/Henu-Computer-Survival-Guide&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=CS-Survive-henu/Henu-Computer-Survival-Guide&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=CS-Survive-henu/Henu-Computer-Survival-Guide&type=Timeline" />
 </picture>
</a>
