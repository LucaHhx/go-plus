/**
 * Tailwind CSS Extended Config -- GO PLUS 管理后台
 * 管理后台使用独立深蓝色系深色主题
 * 直接从 merge.html tailwind.config 提取
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1a1a2e',
          card: '#16213e',
          hover: '#1f2b47',
        },
        accent: {
          DEFAULT: '#24EE89',
          dark: '#1DBF6E',
          light: 'rgba(36,238,137,0.12)',
        },
        txt: {
          DEFAULT: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        border: '#334155',
        danger: '#ef4444',
        warn: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      width: {
        'admin-sidebar': '240px',
      },
      height: {
        'admin-header': '56px',
      },
    },
  },
}
