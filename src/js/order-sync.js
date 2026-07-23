// ===== 訂單同步：Google Sheet 登記 + LINE 通知 =====
// 訂單送出後，前端會把訂單資料 POST 到 Google Apps Script Web App，
// 由 Apps Script 寫入 Google Sheet，並（可選）透過 LINE Messaging API 通知店主。
// 完整設定步驟請見 docs/訂單串接設定說明.md，後端程式碼在 docs/google-apps-script.gs。

const ORDER_SYNC = {
  // ★ 店主注意：部署 Google Apps Script 後，把「網頁應用程式」網址貼到這裡
  //（格式：https://script.google.com/macros/s/XXXX/exec）
  webhookUrl: '',

  // LINE 官方帳號加好友連結（全站共用）
  lineUrl: 'https://lin.ee/5bs67zb',

  isEnabled() {
    return /^https:\/\/script\.google\.com\/macros\//.test(this.webhookUrl);
  },

  // type: 'order'（新訂單）或 'payment'（匯款回報）
  // Apps Script 不回應 CORS header，用 no-cors + text/plain 送出即可寫入
  send(type, payload) {
    if (!this.isEnabled()) {
      console.warn('[order-sync] 尚未設定 Google Apps Script 網址，訂單僅存在瀏覽器本機');
      return Promise.resolve(false);
    }
    return fetch(this.webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: type, data: payload })
    }).then(() => true).catch((err) => {
      console.error('[order-sync] 傳送失敗', err);
      return false;
    });
  },

  // 產生給顧客貼到 LINE 的訂單文字
  buildLineMessage(order) {
    const items = order.items
      .map(i => `${i.name} x${i.quantity}盒`)
      .join('\n');
    return [
      '🍑 果然甜訂單通知',
      `訂單編號：${order.orderNo}`,
      `訂購人：${order.customer.name}`,
      `電話：${order.customer.phone}`,
      order.customer.lineId ? `LINE ID：${order.customer.lineId}` : '',
      `地址：${order.customer.address}`,
      `警衛室代收：${order.customer.guard || '未填寫'}`,
      '----------------',
      items,
      '----------------',
      `商品小計：NT$ ${order.subtotal.toLocaleString()}`,
      `運費：${order.shipping === 0 ? '免運費' : 'NT$ ' + order.shipping.toLocaleString()}`,
      `訂單總計：NT$ ${order.total.toLocaleString()}`,
      order.customer.note ? `備註：${order.customer.note}` : ''
    ].filter(Boolean).join('\n');
  }
};
