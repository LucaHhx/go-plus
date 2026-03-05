/**
 * Tailwind CSS Extended Config -- GO PLUS User System
 * 基于 design.md 设计系统生成
 * 前端项目可直接复用此配置到 tailwind.config.js 的 theme.extend 中
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#232626',
          deep: '#1A1D1D',
          card: '#2A2D2D',
          hover: '#323738',
          input: '#1E2121',
        },
        brand: {
          DEFAULT: '#24EE89',
          dark: '#1DBF6E',
          end: '#9FE871',
        },
        txt: {
          DEFAULT: '#FFFFFF',
          secondary: '#B0B3B3',
          muted: '#6B7070',
        },
        divider: '#3A4142',
        error: '#FF4757',
        'input-border': '#3A4142',
      },
      fontFamily: {
        sans: ['AvertaStd', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
      },
      maxWidth: {
        mobile: '430px',
      },
      height: {
        header: '56px',
        input: '48px',
        btn: '48px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
      spacing: {
        /* 使用 Tailwind 默认 4px 基础间距，此处无需额外扩展 */
      },
    },
  },
}
