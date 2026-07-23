// 主要 JS - 首頁
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
      const spec = f.name.replace('梨山牛奶水蜜桃 ', '');
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

  // 渲染首頁熱銷水果（水蜜桃已在快速訂購區，這裡顯示其他好物）
  const homeProducts = document.getElementById('homeProducts');
  if (homeProducts) {
    const topFruits = fruitsData.filter(f => f.inStock && !f.name.includes('水蜜桃')).slice(0, 4);
    homeProducts.innerHTML = topFruits.map(f => createProductCard(f)).join('');
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
