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

// 產品卡片生成器
function createProductCard(fruit, showAddToCart = true) {
  const tagHtml = fruit.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const stars = '★'.repeat(Math.floor(fruit.rating)) + (fruit.rating % 1 >= 0.5 ? '½' : '');

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
          <span>🍬 糖度 ${fruit.sugar}</span>
        </div>
        <p class="product-desc">${fruit.description.substring(0, 50)}...</p>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-label">NT$</span>
            <span class="price-amount">${fruit.price}</span>
            <span class="price-unit">/${fruit.unit}</span>
          </div>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="review-count">(${fruit.reviews})</span>
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

// 初始化購物車數量
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCount();
});
