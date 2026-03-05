/**
 * Tailwind CSS Extended Config -- GO PLUS 游戏大厅
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
          input: '#1E2020',
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
        favourite: '#FF4757',
        'input-border': '#3A4142',
        'chip-active': '#3A4142',
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
        search: '40px',
        filter: '36px',
        tabbar: '64px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
      aspectRatio: {
        'game-card': '1 / 1',
      },
      gridTemplateColumns: {
        'game-grid': 'repeat(3, minmax(0, 1fr))',
        'provider-grid': 'repeat(4, minmax(0, 1fr))',
      },
      spacing: {
        /* 使用 Tailwind 默认 4px 基础间距 */
      },
    },
  },
}
