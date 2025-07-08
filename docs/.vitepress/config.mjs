import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "河南大学计算机生存指北",
  description: "CS-Survive-Henu is a project that provides a series of guides for CS students at Henan University.",
  lang: 'zh-CN',
  base: '/',
  
  // 部署配置
  outDir: '.vitepress/dist',
  
  // 确保静态资源正确加载
  assetsDir: 'assets',
  
  // 临时忽略死链接检查
  ignoreDeadLinks: true,
  
  // 清理 URL
  cleanUrls: true,
  
  // 站点地图
  sitemap: {
    hostname: 'https://cs-survive-henu.github.io'
  },
  
  // 主题配置
  themeConfig: {
    // 网站标题
    siteTitle: '河南大学计算机生存指北',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '新生指南', link: '/guide/' },
      { text: 'AI学习指南', link: '/ai/' },
      { text: '竞赛指北', link: '/competitions/' },
      { text: 'Linux指南', link: '/linux/' },
      { text: '开源贡献', link: '/opensource/' },
      { text: '升学就业', link: '/career/' }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '新生指南',
          items: [
            { text: '概述', link: '/guide/' },
            { text: '新生工具箱', link: '/guide/toolkit' },
            { text: '学会提问', link: '/guide/how-to-ask' },
            { text: '试着去成为一个有梦想的CS人', link: '/guide/dream' }
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI学习指南',
          items: [
            { text: '概述', link: '/ai/' },
            { text: '如何使用AI', link: '/ai/how-to-use' },
            { text: 'AI发展方向', link: '/ai/direction' }
          ]
        }
      ],
      '/competitions/': [
        {
          text: '竞赛指北',
          items: [
            { text: '概述', link: '/competitions/' },
            { text: 'ACM-ICPC', link: '/competitions/acm-icpc' },
            { text: 'CTF', link: '/competitions/ctf' },
            { text: '挑战杯', link: '/competitions/challenge-cup' }
          ]
        }
      ],
      '/linux/': [
        {
          text: 'Linux指南',
          items: [
            { text: '概述', link: '/linux/' },
            { text: 'Linux基础', link: '/linux/basics' },
            { text: 'Linux命令', link: '/linux/commands/' },
            { text: 'Shell脚本编程', link: '/linux/scripting' },
            { text: 'Linux学习笔记', link: '/linux/notes/' }
          ]
        }
      ],
      '/opensource/': [
        {
          text: '开源贡献',
          items: [
            { text: '概述', link: '/opensource/' },
            { text: '如何贡献', link: '/opensource/how-to-contribute' },
            { text: '新手项目', link: '/opensource/beginner-projects' },
            { text: '开源精神', link: '/opensource/spirit-license' }
          ]
        }
      ],
      '/career/': [
        {
          text: '升学就业',
          items: [
            { text: '概述', link: '/career/' },
            { text: '保研考研出国', link: '/career/graduate-school' },
            { text: '实验室选择', link: '/career/lab-selection' },
            { text: '职业规划', link: '/career/career-planning' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/CS-Survive-henu/CS-Survive-henu.github.io' }
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present 河南大学计算机学院'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/CS-Survive-henu/CS-Survive-henu.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式开关标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // 头部标签
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'keywords', content: '河南大学,计算机,生存指北,学习指南,编程,AI,Linux,开源' }],
    ['meta', { name: 'author', content: '河南大学计算机学院' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: '河南大学计算机生存指北' }],
    ['meta', { property: 'og:description', content: '为河南大学计算机科学与技术专业学生提供的全面学习指南' }],
    ['meta', { property: 'og:site_name', content: '河南大学计算机生存指北' }],
    ['meta', { property: 'og:url', content: 'https://cs-survive-henu.github.io/' }],
    ['meta', { property: 'og:image', content: 'https://cs-survive-henu.github.io/logo.png' }]
  ],

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      // 可以在这里添加markdown插件
    }
  },

  // Vite 配置
  vite: {
    server: {
      port: 5173,
      host: '0.0.0.0'
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue'],
            'vitepress-vendor': ['vitepress']
          }
        }
      }
    }
  }
})
