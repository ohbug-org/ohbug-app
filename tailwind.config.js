module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ant-primary-color)',
        success: 'var(--ant-success-color)',
        info: 'var(--ant-info-color)',
        warning: 'var(--ant-warning-color)',
        error: 'var(--ant-error-color)',
      },
    },
  },
  variants: {},
  plugins: [],
}
