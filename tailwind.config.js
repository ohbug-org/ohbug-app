module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
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
  variants: {},
  plugins: [],
}
