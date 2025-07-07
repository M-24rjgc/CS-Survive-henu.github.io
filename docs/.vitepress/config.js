import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "河南大学计算机生存指北",
  description: "CS-Survive-Henu is a project that provides a series of guides for CS students at Henan University.",
  lang: 'zh-CN',
  base: '/',
  
  // 部署配置
  outDir: '../dist',
  
  // 忽略死链接检查（临时解决方案）
  ignoreDeadLinks: true,
  
  // 主题配置
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '新生指南', link: '/guide/' },
      { text: 'AI学习指南', link: '/ai/' },
      { text: '竞赛指北', link: '/competitions/' },
      { text: 'Linux指南', link: '/linux/' },
      { text: '开源贡献', link: '/opensource/' },
      { text: '升学就业', link: '/career/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '新生指南',
          items: [
            { text: '开始', link: '/guide/' },
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
            { text: '如何使用AI', link: '/ai/how-to-use' }
          ]
        }
      ],
      '/competitions/': [
        {
          text: '竞赛指北',
          items: [
            { text: '概述', link: '/competitions/' }
          ]
        }
      ],
      '/linux/': [
        {
          text: 'Linux指南',
          items: [
            { text: '概述', link: '/linux/' }
          ]
        }
      ],
      '/opensource/': [
        {
          text: '开源贡献',
          items: [
            { text: '概述', link: '/opensource/' }
          ]
        }
      ],
      '/career/': [
        {
          text: '升学就业',
          items: [
            { text: '概述', link: '/career/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CS-Survive-henu/CS-Survive-henu.github.io' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 河南大学计算机学院'
    },

    search: {
      provider: 'local'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { name: 'keywords', content: '河南大学,计算机,生存指北,学习指南' }],
    ['meta', { name: 'author', content: '河南大学计算机学院' }]
  ],

  // Markdown 配置
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
