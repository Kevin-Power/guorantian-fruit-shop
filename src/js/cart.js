// 購物車管理
const Cart = {
  // 只保留本季可購買的商品，並以最新資料更新名稱與價格
  //（避免顧客瀏覽器裡殘留上一季的購物車被拿去結帳）
  items: (() => {
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch (e) { saved = []; }
    return saved.map(i => {
      const f = fruitsData.find(x => x.id === i.id);
      return f && isBuyable(f)
        ? { id: f.id, name: f.name, emoji: f.emoji, price: f.price, unit: f.unit, quantity: i.quantity }
        : null;
    }).filter(Boolean);
  })(),

  save() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    this.updateCount();
  },

  add(fruitId, quantity = 1) {
    const fruit = fruitsData.find(f => f.id === fruitId);
    if (!fruit || !isBuyable(fruit)) return false;

    const existing = this.items.find(i => i.id === fruitId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: fruit.id,
        name: fruit.name,
        emoji: fruit.emoji,
        price: fruit.price,
        unit: fruit.unit,
        quantity: quantity
      });
    }
    this.save();
    this.showToast(`${fruit.emoji} ${fruit.name} 已加入購物車！`);
    return true;
  },

  remove(fruitId) {
    this.items = this.items.filter(i => i.id !== fruitId);
    this.save();
  },

  updateQuantity(fruitId, quantity) {
    const item = this.items.find(i => i.id === fruitId);
    if (item) {
      if (quantity <= 0) {
        this.remove(fruitId);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  clear() {
    this.items = [];
    this.save();
  },

  updateCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
      const count = this.getCount();
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'flex' : 'none';
    }
    renderCartBar();
    if (typeof renderHomeCheckout === 'function') renderHomeCheckout();
  },

  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

// ===== 運費（規則設定在 data.js 的 SHIPPING_RULES）=====
// freeFrom：同一地址滿 N 盒免運；freeEvery：N 的倍數免運，餘數盒數依 tiers 級距計費
function calcShipping(boxCount) {
  if (boxCount <= 0) return 0;
  if (SHIPPING.freeFrom && boxCount >= SHIPPING.freeFrom) return 0;
  let billable = boxCount;
  if (SHIPPING.freeEvery) {
    billable = boxCount % SHIPPING.freeEvery;
    if (billable === 0) return 0;
  }
  const tier = SHIPPING.tiers.find(t => billable <= t.upTo) || SHIPPING.tiers[SHIPPING.tiers.length - 1];
  return tier.fee;
}

// 距離免運還差幾盒（已免運回傳 0）
function boxesToFreeShipping(boxCount) {
  if (SHIPPING.freeFrom) return Math.max(0, SHIPPING.freeFrom - boxCount);
  const remainder = boxCount % SHIPPING.freeEvery;
  return remainder === 0 ? 0 : SHIPPING.freeEvery - remainder;
}

// 免運提示文字（購物車、結帳摘要共用）
function shippingHint(boxCount) {
  const need = boxesToFreeShipping(boxCount);
  if (need === 0) {
    return SHIPPING.freeFrom
      ? `🎉 ${boxCount} 盒，同一地址享免運`
      : `🎉 ${boxCount} 盒（${SHIPPING.freeEvery}的倍數）享免運優惠`;
  }
  return SHIPPING.freeFrom
    ? `目前 ${boxCount} 盒，再加 ${need} 盒（同一地址滿 ${SHIPPING.freeFrom} 盒）即享免運`
    : `目前 ${boxCount} 盒，再加 ${need} 盒湊滿 ${SHIPPING.freeEvery} 的倍數即享免運`;
}

// 這個商品現在能不能下單：有貨、已定價、本季未完售
function isBuyable(fruit) {
  return fruit.inStock && fruit.price != null && !(typeof SOLD_OUT !== 'undefined' && SOLD_OUT);
}

// 產品卡片生成器
function createProductCard(fruit, showAddToCart = true) {
  const tagHtml = fruit.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const buyable = isBuyable(fruit);
  const soldOut = !fruit.inStock || (typeof SOLD_OUT !== 'undefined' && SOLD_OUT);

  return `
    <div class="product-card ${!fruit.inStock ? 'out-of-stock' : ''}" data-id="${fruit.id}">
      <div class="product-emoji-wrap ${fruit.photo ? 'has-photo' : ''}">
        ${fruit.photo
          ? `<img class="product-photo" src="${fruit.photo}" alt="${fruit.name} 出貨實拍" loading="lazy">${fruit.img ? `<img class="product-photo-badge" src="${fruit.img}" alt="">` : ''}`
          : fruit.img ? `<img class="product-art" src="${fruit.img}" alt="${fruit.name}">` : `<div class="product-emoji">${fruit.emoji}</div>`}
        ${!fruit.inStock ? '<div class="sold-out-badge">已售完</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-tags">${tagHtml}</div>
        <h3 class="product-name">${fruit.name}</h3>
        <div class="product-meta">
          <span>📍 ${fruit.origin}</span>
          <span>🏔️ 海拔2000公尺</span>
        </div>
        <p class="product-desc">${fruit.description.substring(0, 50)}...</p>
        <div class="product-footer">
          <div class="product-price">
            ${fruit.price != null ? `
            <span class="price-label">NT$</span>
            <span class="price-amount">${fruit.price.toLocaleString()}</span>` : `
            <span class="price-tbd">價格確認中</span>`}
            <span class="price-unit">/${fruit.unit}</span>
          </div>
        </div>
        ${showAddToCart ? `
        <button class="btn-add-cart ${!buyable ? 'disabled' : ''}"
          onclick="handleAddToCart(${fruit.id})"
          ${!buyable ? 'disabled' : ''}>
          ${buyable ? '🛒 加入購物車' : soldOut ? '🙏 本季完售，感謝支持' : '⏳ 即將開賣'}
        </button>` : ''}
      </div>
    </div>
  `;
}

function handleAddToCart(fruitId) {
  if (!Cart.add(fruitId)) return;
  const btn = document.querySelector(`[data-id="${fruitId}"] .btn-add-cart`);
  if (btn) {
    btn.textContent = '✅ 已加入！';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '🛒 加入購物車';
      btn.classList.remove('added');
    }, 1500);
  }
}

// 底部快速結帳列（購物車頁自帶摘要，用 body[data-no-cartbar] 關閉）
function renderCartBar() {
  if (!document.body || document.body.hasAttribute('data-no-cartbar')) return;
  let bar = document.getElementById('cartBar');
  const boxes = Cart.getCount();
  if (boxes === 0) {
    if (bar) bar.remove();
    document.body.classList.remove('has-cartbar');
    return;
  }
  const shipping = calcShipping(boxes);
  const total = Cart.getTotal() + shipping;
  const need = boxesToFreeShipping(boxes);
  const hint = need === 0 ? '🎉 已達免運' : `再 ${need} 盒免運`;
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'cartBar';
    bar.className = 'cart-bar';
    document.body.appendChild(bar);
    document.body.classList.add('has-cartbar');
  }
  bar.innerHTML = `
    <div class="cart-bar-inner">
      <div class="cart-bar-info">
        <strong>🛒 ${boxes} 盒</strong>
        <span>${shipping === 0 ? '免運費' : '運費 NT$ ' + shipping}</span>
        <span class="cart-bar-hint">${hint}</span>
      </div>
      <div class="cart-bar-total">NT$ ${total.toLocaleString()}</div>
      <a href="${document.getElementById('home-checkout') ? '#home-checkout' : 'cart.html'}" class="cart-bar-btn">去結帳 →</a>
    </div>`;
}

// 把清理過的購物車存回瀏覽器
try { localStorage.setItem('cartItems', JSON.stringify(Cart.items)); } catch (e) {}

// 初始化購物車數量
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCount();
});
