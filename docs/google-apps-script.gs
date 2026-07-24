/**
 * 果然甜 — 訂購單登記 Google Apps Script
 *
 * 功能：
 *   1. 接收網站送出的「新訂單」與「匯款回報」，自動寫入 Google Sheet
 *   2. （選用）透過 LINE Messaging API 推播通知店主
 *   3. （選用）寄 Email 通知店主
 *
 * 部署步驟請見同資料夾的「訂單串接設定說明.md」
 */

// ★★★ 必填：Google Sheet 的 ID（試算表網址中 /d/ 與 /edit 之間那串）★★★
const SHEET_ID = '請貼上你的試算表ID';

const ORDER_SHEET_NAME = '訂單';
const PAYMENT_SHEET_NAME = '匯款回報';

// ── 選用：LINE 通知（LINE Messaging API）──
// 到 https://developers.line.biz 建立 Messaging API channel 後填入
const LINE_CHANNEL_ACCESS_TOKEN = ''; // Channel access token (long-lived)
const LINE_ADMIN_USER_ID = '';        // 接收通知的 LINE userId（開發者主控台 Basic settings 的 Your user ID）

// ── 選用：Email 通知 ──
const NOTIFY_EMAIL = ''; // 例如 'salonpas1008@gmail.com'，留空則不寄信

// 瀏覽器直接打開 /exec 網址可看到這個訊息，代表部署與存取權設定成功
function doGet() {
  return jsonOutput({ ok: true, message: '🍑 果然甜訂單 webhook 運作中' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.type === 'order') {
      handleOrder(body.data);
    } else if (body.type === 'payment') {
      handlePayment(body.data);
    }
    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

function handleOrder(order) {
  const sheet = getSheet(ORDER_SHEET_NAME, [
    '登記時間', '訂單編號', '訂購人', '電話', 'LINE ID', 'Email', '收件地址', '警衛室代收',
    '訂購明細', '總盒數', '商品小計', '冷鏈運費', '訂單總計', '備註', '狀態'
  ]);
  const itemsText = (order.items || [])
    .map(function (i) { return i.name + ' x' + i.quantity + '盒'; })
    .join('\n');
  const boxes = (order.items || [])
    .reduce(function (sum, i) { return sum + Number(i.quantity || 0); }, 0);
  const c = order.customer || {};

  sheet.appendRow([
    new Date(), order.orderNo, c.name, "'" + (c.phone || ''), c.lineId || '', c.email || '', c.address || '', c.guard || '',
    itemsText, boxes, order.subtotal, order.shipping, order.total, c.note || '', '待匯款'
  ]);

  const msg = [
    '🍑 果然甜 新訂單！',
    '訂單編號：' + order.orderNo,
    '訂購人：' + c.name + '（' + c.phone + '）',
    c.lineId ? 'LINE ID：' + c.lineId : '',
    '地址：' + c.address,
    '警衛室代收：' + (c.guard || '未填寫'),
    '----------------',
    itemsText,
    '----------------',
    '共 ' + boxes + ' 盒',
    '運費：' + (order.shipping === 0 ? '免運' : 'NT$ ' + order.shipping),
    '總計：NT$ ' + order.total,
    c.note ? '備註：' + c.note : ''
  ].filter(Boolean).join('\n');

  notifyLine(msg);
  notifyEmail('🍑 新訂單 ' + order.orderNo + '（NT$ ' + order.total + '）', msg);
}

function handlePayment(p) {
  // 撈出這筆訂單的應付總金額，直接在表上核對
  const orderInfo = findOrder(p.orderNo);
  const expected = orderInfo ? orderInfo.total : '';
  let check;
  if (!orderInfo) {
    check = '⚠️ 找不到訂單';
  } else if (Number(p.amount) === Number(orderInfo.total)) {
    check = '✅ 金額相符';
  } else {
    const diff = Number(p.amount) - Number(orderInfo.total);
    check = '⚠️ 金額不符（' + (diff > 0 ? '多 ' : '少 ') + Math.abs(diff) + ' 元）';
  }

  const sheet = getSheet(PAYMENT_SHEET_NAME, [
    '回報時間', '訂單編號', '匯款人', '帳號末五碼', '匯款金額', '應付總金額', '金額核對', '匯款日期', '匯款銀行', '備註'
  ]);
  sheet.appendRow([
    new Date(), p.orderNo, p.name, "'" + (p.last5 || ''), p.amount, expected, check, p.date, p.bank || '', p.note || ''
  ]);

  // 同步把「訂單」工作表的狀態改為已回報，附上末五碼方便對帳
  if (orderInfo && orderInfo.statusCol > 0) {
    orderInfo.sheet.getRange(orderInfo.row, orderInfo.statusCol)
      .setValue('已回報匯款・末五碼 ' + (p.last5 || '?'));
  }

  const msg = [
    '💰 果然甜 匯款回報',
    '訂單編號：' + p.orderNo,
    '匯款人：' + p.name,
    '末五碼：' + p.last5,
    '匯款金額：NT$ ' + p.amount,
    orderInfo ? '應付總額：NT$ ' + orderInfo.total : '',
    '核對結果：' + check,
    '日期：' + p.date
  ].filter(Boolean).join('\n');

  notifyLine(msg);
  notifyEmail('💰 匯款回報 ' + p.orderNo + '（' + check + '）', msg);
}

// 依訂單編號在「訂單」工作表找出該筆訂單（由下往上找最新的一筆）
function findOrder(orderNo) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(ORDER_SHEET_NAME);
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  const headers = data[0];
  const noCol = headers.indexOf('訂單編號');
  const totalCol = headers.indexOf('訂單總計');
  const statusCol = headers.indexOf('狀態');
  if (noCol < 0) return null;
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][noCol]).trim() === String(orderNo).trim()) {
      return {
        sheet: sheet,
        row: i + 1,
        total: totalCol >= 0 ? data[i][totalCol] : '',
        statusCol: statusCol + 1
      };
    }
  }
  return null;
}

// 取得工作表，不存在就建立並寫入標題列
function getSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notifyLine(text) {
  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_ADMIN_USER_ID) return;
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN },
    payload: JSON.stringify({
      to: LINE_ADMIN_USER_ID,
      messages: [{ type: 'text', text: text }]
    }),
    muteHttpExceptions: true
  });
}

function notifyEmail(subject, body) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 在 Apps Script 編輯器裡執行這個函式，可測試 Sheet 寫入是否正常
function testAppend() {
  handleOrder({
    orderNo: 'GRT-TEST0001',
    customer: { name: '測試客人', phone: '0912345678', lineId: 'test_line_id', email: 'test@example.com', address: '台北市測試路1號', guard: '有警衛室可代收', note: '這是測試訂單' },
    items: [{ name: '梨山牛奶水蜜桃 8粒裝', quantity: 2 }],
    subtotal: 1500, shipping: 300, total: 1800
  });
}

// 測試匯款回報＋自動核對（先跑 testAppend 建立測試訂單再跑這個）
function testPayment() {
  handlePayment({
    orderNo: 'GRT-TEST0001',
    name: '測試客人',
    last5: '12345',
    amount: 1800,
    date: '2026-07-24',
    bank: '測試銀行',
    note: '測試匯款回報'
  });
}
