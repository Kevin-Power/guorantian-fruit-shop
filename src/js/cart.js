// 購物車管理
const Cart = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),

  save() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    this.updateCount();
  },

  add(fruitId, quantity = 1) {
    const fruit = fruitsData.find(f => f.id === fruitId);
    if (!fruit || !fruit.inStock) return false;

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

// ===== 全程冷鏈配送運費 =====
// 1～2盒 300 元、3～5盒 380 元、同一地址滿6盒免運；
// 6的倍數（6、12、18、24…盒）皆免運，超出的餘數盒數依上述級距計費。
// 8～10盒採全冷鏈分箱配送，確保配送品質（不另收費）。
function calcShipping(boxCount) {
  if (boxCount <= 0) return 0;
  const remainder = boxCount % 6;
  if (remainder === 0) return 0;
  return remainder <= 2 ? 300 : 380;
}

// 產品卡片生成器
function createProductCard(fruit, showAddToCart = true) {
  const tagHtml = fruit.tags.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <div class="product-card ${!fruit.inStock ? 'out-of-stock' : ''}" data-id="${fruit.id}">
      <div class="product-emoji-wrap">
        <div class="product-emoji">${fruit.emoji}</div>
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
            <span class="price-label">NT$</span>
            <span class="price-amount">${fruit.price}</span>
            <span class="price-unit">/${fruit.unit}</span>
          </div>
        </div>
        ${showAddToCart ? `
        <button class="btn-add-cart ${!fruit.inStock ? 'disabled' : ''}"
          onclick="handleAddToCart(${fruit.id})"
          ${!fruit.inStock ? 'disabled' : ''}>
          ${fruit.inStock ? '🛒 加入購物車' : '❌ 暫時缺貨'}
        </button>` : ''}
      </div>
    </div>
  `;
}

function handleAddToCart(fruitId) {
  Cart.add(fruitId);
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
  const remainder = boxes % 6;
  const hint = remainder === 0 ? '🎉 已達免運' : `再 ${6 - remainder} 盒免運`;
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
      <a href="cart.html" class="cart-bar-btn">去結帳 →</a>
    </div>`;
}

// 初始化購物車數量
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCount();
});
