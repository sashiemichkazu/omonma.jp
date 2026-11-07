/* お問い合わせフォーム：?message= で渡された内容を、メッセージ欄に自動で入力する。
   使い方：contact.html の </body> の直前に <script src="contact-prefill.js"></script> を1行足すだけ。 */
(function () {
  var msg = new URLSearchParams(location.search).get('message');
  if (!msg) return;

  var SELECTORS = [
    'textarea[name="message"]', '#message',
    'textarea[name*="message" i]', 'textarea[name*="content" i]', 'textarea[name*="body" i]',
    'textarea'
  ];
  function findBox() {
    for (var i = 0; i < SELECTORS.length; i++) {
      var el = document.querySelector(SELECTORS[i]);
      if (el) return el;
    }
    return null;
  }
  function fill() {
    var box = findBox();
    if (!box) return false;
    if (!box.value) {            // すでに入力済みなら上書きしない
      box.value = msg;
      box.dispatchEvent(new Event('input', { bubbles: true }));
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }
  function start() {
    if (fill()) return;
    // フォームがあとから表示される作りでも入力できるよう、3秒だけ待つ
    var mo = new MutationObserver(function () { if (fill()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 3000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
