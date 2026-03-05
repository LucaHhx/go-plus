/**
 * Tailwind CSS Extended Config -- GO PLUS 客服系统
 * 继承全局设计系统 (docs/2-homepage-navigation/ui/Resources/tailwind.config.js)
 * 此文件仅包含客服模块的补充配置
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        chat: {
          'user-bubble': '#24EE89',
          'agent-bubble': '#2A2D2D',
          'user-text': '#1A1D1D',
          'agent-text': '#FFFFFF',
          'input-bg': '#2A2D2D',
        },
        online: '#24EE89',
        offline: '#6B7070',
      },
      maxWidth: {
        'chat-bubble': '280px',
      },
      borderRadius: {
        'chat': '12px',
      },
    },
  },
}
