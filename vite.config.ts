import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }
}) 