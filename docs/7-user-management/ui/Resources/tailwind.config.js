/**
 * Tailwind CSS Extended Config -- GO PLUS User Management
 * 继承 1-user-system 全局设计系统，新增用户管理模块的扩展
 * 前端项目可直接合并此配置到 tailwind.config.js 的 theme.extend 中
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
        danger: '#FF4757',
        warning: '#FFA502',
        success: '#24EE89',
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
      width: {
        'avatar-sm': '48px',
        'avatar-lg': '80px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
}
