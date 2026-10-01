(function () {
  const loc = window.location.pathname;
  const isHome = loc.endsWith('index.html') || loc.endsWith('/') || loc === '';

  const navHTML = `
<nav class="site-nav" id="site-nav">
  <a class="nav-brand" href="${isHome ? '#hero-section' : 'index.html'}"><img src="images/logo.png" alt="omonma"></a>
  <button class="nav-toggle" id="nav-toggle" aria-label="メニュー" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links">
    <li><a href="${isHome ? '#collections' : 'index.html#collections'}">コレクション</a></li>
    <li><a href="about.html">ブランドについて</a></li>
    <li><a href="contact.html">お問い合わせ</a></li>
  </ul>
</nav>`;

  const footerHTML = `
<footer class="site-footer-inner">
  <div class="footer-brand"><img src="images/logo.png" alt="omonma"></div>
  <p class="footer-tagline">暮らしに、木の温度を。</p>
  <nav class="footer-nav" aria-label="フッターナビ">
    <a href="${isHome ? '#collections' : 'index.html#collections'}">コレクション</a>
    <a href="about.html">ブランドについて</a>
    <a href="contact.html">お問い合わせ</a>
  </nav>
  <p class="footer-copy">© 2026 omonma. All rights reserved.</p>
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
