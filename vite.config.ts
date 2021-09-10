/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import reactJsx from 'vite-react-jsx'
import reactRefresh from '@vitejs/plugin-react-refresh'
import WindiCSS from 'vite-plugin-windicss'
import vitePluginImp from 'vite-plugin-imp'
import visualizer from 'rollup-plugin-visualizer'

import pkg from './package.json'

export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version.toString()),
    },
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import "${path.resolve(
              __dirname,
              'src/styles/theme.less'
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: [reactJsx(), reactRefresh(), WindiCSS()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react'],
            'react-dom': ['react-dom'],
            antd: ['antd'],
            echarts: ['echarts'],
            'markdown-it': ['markdown-it'],
          },
        },
      },
    },
  }
  if (mode === 'development') {
    config.server = {
      port: 8888,
      proxy: {
        '/api/v1': {
          target: 'http://localhost:6666',
          changeOrigin: true,
        },
      },
    }
  }
  if (mode === 'production') {
    if (config.plugins) {
      config.plugins.push(
        vitePluginImp({
          libList: [
            {
              libName: 'antd',
              style: (name) => `antd/es/${name}/style`,
            },
          ],
        })
      )
      config.plugins.push(
        visualizer({
          filename: './node_modules/.cache/visualizer/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      )
    }
  }

  return config
})
