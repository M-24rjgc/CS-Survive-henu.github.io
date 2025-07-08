// VitePress 自定义主题
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加自定义插槽
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 应用程序级别的配置
  }
}
