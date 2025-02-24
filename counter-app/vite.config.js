import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8081,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  build: {
    assetsInlineLimit: 0, // 禁用资源内联
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (ext === 'wasm') {
            return `assets/wasm/[name][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['../assets/wasm/rust_wasm.js']
  }
}) 