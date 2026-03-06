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

  // 渲染首頁熱銷水果 (前4個)
  const homeProducts = document.getElementById('homeProducts');
  if (homeProducts) {
    const topFruits = fruitsData.filter(f => f.inStock).slice(0, 4);
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
