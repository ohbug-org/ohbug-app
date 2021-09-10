// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        success: 'var(--success-color)',
        info: 'var(--info-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        secondary: 'var(--text-color-secondary)',
      },
    },
  },
  extract: {
    include: ['src/**/*.{js,ts,jsx,tsx,css,less}', 'index.html'],
    exclude: ['node_modules', '.git'],
  },
})
