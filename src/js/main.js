// 主要 JS - 首頁
// 標記本頁有進場動畫（CSS 以 html.anim 判斷是否先隱藏 section-header）
document.documentElement.classList.add('anim');

document.addEventListener('DOMContentLoaded', () => {
  // 漢堡選單
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // 滾動時導覽列效果
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 渲染首頁快速訂購（水蜜桃四規格）
  const qoGrid = document.getElementById('quickOrderGrid');
  if (qoGrid) {
    const qoBadges = { 13: '🏠 自家吃首選', 21: '🔥 回購 No.1', 22: '🎁 送禮首選', 23: '👑 頂級限量' };
    const peaches = fruitsData.filter(f => qoBadges[f.id]);
    qoGrid.innerHTML = peaches.map(f => {
      const spec = f.name.replace(/梨山(牛奶|上海蜜)水蜜桃 /, '');
      const weight = f.unit.replace(/^盒（/, '').replace(/）$/, '');
      return `
        <div class="qo-card ${f.id === 23 ? 'qo-limited' : ''}">
          ${f.id === 21 ? '<div class="qo-flag">最多人買</div>' : ''}
          <div class="qo-badge">${qoBadges[f.id]}</div>
          <div class="qo-emoji">🍑</div>
          <h3 class="qo-title">${spec}</h3>
          <div class="qo-weight">${weight}</div>
          <div class="qo-price"><span class="qo-cur">NT$</span>${f.price.toLocaleString()}<span class="qo-unit">／盒</span></div>
          ${f.id === 23 ? '<div class="qo-preorder-note">限量預訂・依採收供貨</div>' : ''}
          <div class="qo-qty">
            <button class="qo-qty-btn" onclick="qoChangeQty(${f.id}, -1)">−</button>
            <span class="qo-qty-num" id="qoQty-${f.id}">1</span>
            <button class="qo-qty-btn" onclick="qoChangeQty(${f.id}, 1)">+</button>
          </div>
          <button class="qo-add" onclick="qoAdd(${f.id})">加入購物車</button>
        </div>`;
    }).join('');
  }

  // 滾動動畫 - animate-in for cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
    observer.observe(el);
  });

  // 滾動動畫 - fade-up for generic elements
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-header, .fade-up').forEach(el => {
    fadeObserver.observe(el);
  });
});

// 快速訂購：數量加減與加入購物車（onclick 需為全域函式）
function qoChangeQty(id, delta) {
  const el = document.getElementById('qoQty-' + id);
  el.textContent = Math.max(1, Math.min(30, parseInt(el.textContent, 10) + delta));
}

function qoAdd(id) {
  const el = document.getElementById('qoQty-' + id);
  Cart.add(id, parseInt(el.textContent, 10));
  el.textContent = 1;
}

// ===== 首頁一頁式結帳 =====
let hcOrderDone = false;

function renderHomeCheckout() {
  const section = document.getElementById('home-checkout');
  if (!section || hcOrderDone) return;
  const boxes = Cart.getCount();
  if (boxes === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  const subtotal = Cart.getTotal();
  const shipping = calcShipping(boxes);
  const total = subtotal + shipping;
  const remainder = boxes % 6;
  const hint = shipping === 0
    ? `🎉 ${boxes} 盒（6的倍數）享免運優惠`
    : `目前 ${boxes} 盒，再加 ${6 - remainder} 盒湊滿 6 的倍數即免運`;
  document.getElementById('hcSummary').innerHTML = `
    <h3 style="font-size:1.15rem;font-weight:800;margin-bottom:14px;padding-bottom:12px;border-bottom:2px solid #F5DDD0;">🧾 訂單摘要</h3>
    ${Cart.items.map(i => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;font-size:0.9rem;">
        <span>${i.emoji} ${i.name.replace(/梨山(牛奶|上海蜜)水蜜桃 /, '水蜜桃 ')} × ${i.quantity}盒</span>
        <span style="font-weight:700;">NT$ ${(i.price * i.quantity).toLocaleString()}</span>
      </div>`).join('')}
    <div style="border-top:1px dashed #F5DDD0;margin-top:10px;padding-top:10px;font-size:0.9rem;">
      <div style="display:flex;justify-content:space-between;padding:3px 0;"><span>商品小計</span><span>NT$ ${subtotal.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;padding:3px 0;"><span>冷鏈運費</span><span>${shipping === 0 ? '<strong style="color:#7BAE84;">免運費</strong>' : 'NT$ ' + shipping}</span></div>
      <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-size:1.2rem;font-weight:900;color:#E8845A;border-top:2px solid #F5DDD0;margin-top:8px;"><span>應付總額</span><span>NT$ ${total.toLocaleString()}</span></div>
    </div>
    <div style="margin-top:10px;padding:9px 12px;background:#FFF8F4;border-radius:8px;font-size:0.8rem;color:#E8845A;font-weight:700;text-align:center;">${hint}</div>
    <div style="margin-top:10px;font-size:0.78rem;color:#A08070;line-height:1.7;">💡 想調整數量？回到上方「選好規格」區用 −/＋ 調整，或到 <a href="cart.html" style="color:#E8845A;font-weight:700;">購物車</a> 修改。</div>`;
}

function submitHomeOrder() {
  if (Cart.items.length === 0) return;
  const subtotal = Cart.getTotal();
  const shipping = calcShipping(Cart.getCount());
  const total = subtotal + shipping;
  const orderNo = 'GRT-' + Date.now().toString().slice(-8);
  const order = {
    orderNo: orderNo,
    date: new Date().toISOString(),
    customer: {
      name: document.getElementById('hcName').value.trim(),
      phone: document.getElementById('hcPhone').value.trim(),
      email: document.getElementById('hcEmail').value.trim(),
      lineId: document.getElementById('hcLine').value.trim(),
      address: document.getElementById('hcAddress').value.trim(),
      guard: document.getElementById('hcGuard').value,
      note: document.getElementById('hcNote').value.trim()
    },
    items: Cart.items.map(i => ({ id: i.id, name: i.name, emoji: i.emoji, price: i.price, unit: i.unit, quantity: i.quantity })),
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    paymentStatus: 'pending',
    paymentInfo: null
  };

  const orders = JSON.parse(localStorage.getItem('grt_orders') || '[]');
  orders.push(order);
  localStorage.setItem('grt_orders', JSON.stringify(orders));

  ORDER_SYNC.send('order', order);

  hcOrderDone = true;
  Cart.clear();
  showHomeOrderSuccess(order);
}

let hcLineText = '';

function hcCopy(btn, text, doneLabel, normalLabel) {
  const done = () => {
    btn.textContent = doneLabel;
    setTimeout(() => { btn.textContent = normalLabel; }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    done();
  }
}

function hcCopyAccount(btn) { hcCopy(btn, '50679502654300', '✅ 帳號已複製！', '📋 複製帳號'); }
function hcCopyOrder(btn) { hcCopy(btn, hcLineText, '✅ 已複製！', '📋 複製訂單內容'); }

function showHomeOrderSuccess(order) {
  hcLineText = ORDER_SYNC.buildLineMessage(order);
  const section = document.getElementById('home-checkout');
  section.style.display = 'block';
  section.querySelector('.container').innerHTML = `
    <div style="max-width:620px;margin:0 auto;background:white;border:2px solid #7BAE84;border-radius:20px;padding:32px 28px;text-align:center;box-shadow:0 12px 40px rgba(123,174,132,0.2);">
      <div style="font-size:3.2rem;margin-bottom:8px;">🎉</div>
      <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:6px;">訂單成立！</h2>
      <p style="color:#666;font-size:0.9rem;margin-bottom:20px;">請於 <strong>3 天內</strong>完成匯款，我們核對後依採收狀況及訂單順序出貨，出貨當天提供黑貓宅配單號</p>
      <div style="background:#FFF8F4;border-radius:12px;padding:16px;text-align:left;font-size:0.9rem;color:#555;line-height:2;margin-bottom:14px;">
        訂單編號：<strong>${order.orderNo}</strong><br>
        ${order.items.map(i => `${i.emoji} ${i.name} × ${i.quantity}盒`).join('<br>')}<br>
        運費：${order.shipping === 0 ? '<span style="color:#7BAE84;font-weight:700;">免運費</span>' : 'NT$ ' + order.shipping}　
        應付總額：<strong style="color:#E8845A;font-size:1.15rem;">NT$ ${order.total.toLocaleString()}</strong>
      </div>
      <div style="background:linear-gradient(135deg,#3D2B1F,#6B4E3D);border-radius:12px;padding:20px;color:white;text-align:left;margin-bottom:14px;">
        <div style="font-weight:800;margin-bottom:8px;">🏦 匯款資訊</div>
        <div style="font-size:0.95rem;line-height:2;">
          銀行：<strong>彰化銀行（代碼 009）</strong><br>
          帳號：<strong style="letter-spacing:1.5px;">50679502654300</strong>
        </div>
        <button onclick="hcCopyAccount(this)" style="margin-top:10px;width:100%;padding:10px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:#FFDAB9;font-weight:700;cursor:pointer;font-family:inherit;">📋 複製帳號</button>
      </div>
      <div style="background:#E9F9EE;border:1px solid #06C755;border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-weight:800;color:#06903E;margin-bottom:8px;font-size:0.95rem;">💬 匯款後，LINE 通知我們最快出貨</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <button onclick="hcCopyOrder(this)" style="padding:10px 16px;background:white;color:#06903E;border:2px solid #06C755;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;">📋 複製訂單內容</button>
          <a href="${ORDER_SYNC.lineUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 16px;background:#06C755;color:white;border-radius:8px;font-weight:700;text-decoration:none;">💬 開啟 LINE 貼上</a>
        </div>
      </div>
      <a href="payment.html?order=${order.orderNo}" style="display:block;padding:13px;background:linear-gradient(135deg,#E8845A,#C96A42);color:white;border-radius:50px;font-weight:800;text-decoration:none;margin-bottom:10px;">🏦 匯款完成後，回報末五碼 →</a>
      <p style="font-size:0.78rem;color:#A08070;">收到商品請第一時間開箱檢查；品質問題請於 24 小時內拍照 LINE 我們處理</p>
    </div>`;
  section.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const homeForm = document.getElementById('homeOrderForm');
  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitHomeOrder();
    });
    renderHomeCheckout();
  }
});
