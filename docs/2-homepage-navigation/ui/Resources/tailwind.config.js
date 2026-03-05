/**
 * Tailwind CSS Extended Config -- GO PLUS Homepage & Navigation (Global Design System)
 * 基于 design.md 设计系统生成
 * 首页是全局设计系统的定义者，前端项目可直接复用此配置
 * 合并到项目 tailwind.config.js 的 theme.extend 中
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
          layer4: '#323738',
          input: '#1E2121',
        },
        brand: {
          DEFAULT: '#24EE89',
          dark: '#1DBF6E',
          end: '#9FE871',
          light: 'rgba(36,238,137,0.15)',
        },
        txt: {
          DEFAULT: '#FFFFFF',
          secondary: '#B0B3B3',
          muted: '#6B7070',
        },
        divider: '#3A3D3D',
        error: '#FF4757',
        warning: '#FFA502',
        'input-border': '#3A4142',
        gold: '#FFD700',
        // Social media brand colors
        social: {
          telegram: '#229ED9',
          facebook: '#1877F2',
          whatsapp: '#25D366',
          youtube: '#FF0000',
        },
      },
      fontFamily: {
        sans: ['AvertaStd', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
      },
      fontWeight: {
        extrabold: '800',
      },
      maxWidth: {
        mobile: '430px',
      },
      height: {
        header: '56px',
        tabbar: '64px',
        input: '48px',
        btn: '48px',
        'btn-sm': '40px',
      },
      width: {
        sidebar: '280px',
        'game-icon': '56px',
        'trending-card': '142px',
      },
      borderRadius: {
        xs: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
      zIndex: {
        header: '1000',
        'sidebar-overlay': '1001',
        'sidebar-panel': '1002',
        tabbar: '999',
      },
      spacing: {
        /* Tailwind default 4px base spacing is sufficient */
        /* Key spacings: 4px(1), 8px(2), 12px(3), 16px(4), 24px(6) */
      },
      backdropBlur: {
        header: '10px',
      },
    },
  },
}
