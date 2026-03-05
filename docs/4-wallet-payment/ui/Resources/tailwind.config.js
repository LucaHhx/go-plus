/**
 * Tailwind CSS Extended Config -- GO PLUS 钱包与支付
 * 继承全局设计系统 (docs/2-homepage-navigation/ui/Resources/tailwind.config.js)
 * 此文件仅包含钱包模块的补充配置
 */

module.exports = {
  theme: {
    extend: {
      // 继承全局 colors, 补充钱包特有色值
      colors: {
        deposit: '#24EE89',
        withdraw: '#FF4757',
        pending: '#FFA502',
        completed: '#24EE89',
        rejected: '#FF4757',
        payment: {
          upi: '#4B5EAA',
          paytm: '#00BAF2',
          amazonpay: '#FF9900',
        },
      },
    },
  },
}
