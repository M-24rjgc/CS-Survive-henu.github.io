# 河南大学计算机生存指北

[![VitePress](https://img.shields.io/badge/VitePress-1.0-brightgreen)](https://vitepress.dev/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://cs-survive-henu.github.io)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 由河南大学计算机学院和软件学院的学生/毕业生共同维护的开源生存指南

## 🌟 项目介绍

这是一个为河南大学计算机类专业学生打造的全方位学习指南，涵盖了从新生入学到毕业就业的各个阶段。项目已从Jekyll迁移到VitePress，提供更好的用户体验和维护性。

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/CS-Survive-henu/CS-Survive-henu.github.io.git
cd CS-Survive-henu.github.io
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:5173`

### 构建和部署

1. 构建项目
```bash
npm run build
```

2. 预览构建结果
```bash
npm run preview
```

3. 部署到GitHub Pages
项目配置了GitHub Actions自动部署，推送到main分支会自动触发部署。

## � 内容导航

### 核心指南
- [新生工具箱](docs/新生工具箱.md) - 必备的开发工具和学习资源
- [AI方向](docs/AI方向.md) - 人工智能学习路径和项目实践
- [竞赛指北](docs/竞赛指北.md) - 各类编程竞赛的参赛指南
- [Linux基础](docs/Linux基础.md) - Linux系统学习和使用技巧

### 升学就业
- [升学指导](docs/升学（保研，考研，or出国）.md) - 升学路径规划和经验分享
- [实验室](docs/实验室.md) - 各实验室介绍和申请指南

### 技能提升
- [学会提问](docs/学会提问.md) - 提问技巧和沟通方法
- [如何使用AI](docs/如何使用AI.md) - AI工具使用指南

### 成长感悟
- [试着去成为一个有梦想的CS人](docs/试着去成为一个有梦想的CS人.md) - 职业规划和成长感悟
- [HCSG-大学开始的地方](docs/HCSG-大学开始的地方.md) - 组织介绍和更多信息

## 🚀 快速开始

### 在线访问
直接访问我们的网站：**https://cs-survive-henu.github.io**

### 本地开发

#### 环境要求
- Node.js 18+
- npm 或 yarn

#### 快速部署

**所有平台:**
```bash
# 克隆项目
git clone https://github.com/CS-Survive-henu/CS-Survive-henu.github.io.git
cd CS-Survive-henu.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```
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
