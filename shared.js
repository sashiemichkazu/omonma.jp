(function () {
  const loc = window.location.pathname;
  const isHome = loc.endsWith('index.html') || loc.endsWith('/') || loc === '';

  const navHTML = `
<nav class="site-nav" id="site-nav">
  <a class="nav-brand" href="${isHome ? '#hero-section' : 'index.html'}"><img src="images/logo.png" alt="omomma"></a>
  <button class="nav-toggle" id="nav-toggle" aria-label="メニュー" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links">
    <li><a href="products.html">商品一覧</a></li>
    <li><a href="about.html">ブランドについて</a></li>
    <li><a href="contact.html">お問い合わせ</a></li>
    <li><a class="nav-cta" href="contact.html">見積もり</a></li>
  </ul>
</nav>`;

  const footerHTML = `
<footer class="site-footer-inner">
  <div class="footer-brand"><img src="images/logo.png" alt="omomma"></div>
  <p class="footer-tagline">子どもと育つ、一生モノの家具。</p>
  <nav class="footer-nav" aria-label="フッターナビ">
    <a href="products.html">商品一覧</a>
    <a href="about.html">ブランドについて</a>
    <a href="contact.html">お問い合わせ</a>
    <a href="tokushoho.html">特定商取引法に基づく表記</a>
    <a href="privacy.html">プライバシーポリシー</a>
  </nav>
  <p class="footer-copy">© 2026 omomma. All rights reserved.</p>
</footer>`;

  // Inject nav
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', navHTML);

  // Inject footer
  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.innerHTML = footerHTML;

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Active link highlight
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.href === window.location.href) a.classList.add('active');
  });
})();
