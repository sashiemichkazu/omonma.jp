(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sub = document.body.classList.contains('sub');

  /* どのページも、開いたときは必ず一番上から表示する（#で場所を指定したリンクだけ、その場所へ） */
  if('scrollRestoration' in history) history.scrollRestoration='manual';
  const goTop=()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    const t=id?document.getElementById(id):null;
    if(t) t.scrollIntoView({behavior:'instant',block:'start'});
    else scrollTo({top:0,left:0,behavior:'instant'});
  };
  goTop();
  addEventListener('load',goTop);
  addEventListener('pageshow',goTop);

  /* 1. 開いたらすぐトップを表示（見出しがふわっと現れる） */
  const heroText = $('#heroText');
  if(heroText) setTimeout(()=>heroText.classList.add('in'), 150);

  /* 2. スクロールで要素をふわっと表示 */
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  $$('.rv,.reveal-img').forEach(el=>io.observe(el));

  /* 3. 職人セクション：スクロールに合わせて1文字ずつ浮かび上がる */
  const cb=$('#craftBody');
  let chars=[];
  if(cb){
    cb.innerHTML=cb.textContent.split(/(?<=[、。])/).map(t=>
      t.split('').map(c=>`<span class="w">${c}</span>`).join('')
    ).join('');
    chars=$$('.craft-body .w');
  }

  /* 4. スクロール連動（視差・進捗バー・ヘッダー） */
  const header=$('#header'), bar=$('#progress');
  const para=$$('[data-speed]');
  let lastY=0, ticking=false;
  function onScroll(){
    const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform=`scaleX(${max>0?y/max:0})`;
    header.classList.toggle('solid',sub||y>80);
    header.classList.toggle('top',!sub&&y<=80);
    header.classList.toggle('hide',y>lastY&&y>400&&!header.classList.contains('open'));
    lastY=y;
    if(!reduce){
      para.forEach(el=>{
        const r=el.parentElement.getBoundingClientRect();
        if(r.bottom<-200||r.top>innerHeight+200)return;
        const d=(r.top+r.height/2-innerHeight/2)*parseFloat(el.dataset.speed);
        el.style.transform=`translate3d(0,${el.classList.contains('hero-img')?y*parseFloat(el.dataset.speed):-d}px,0)`;
      });
    }
    if(cb){
      const cr=cb.getBoundingClientRect();
      const p=Math.min(1,Math.max(0,(innerHeight*0.85-cr.top)/(cr.height+innerHeight*0.3)));
      const n=Math.floor(p*chars.length*1.1);
      chars.forEach((c,i)=>c.classList.toggle('on',i<n));
    }
    ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});
  onScroll();

  /* 5. ギャラリー：ボタン・ドラッグで横スクロール（ドラッグ後はリンクを開かない） */
  const g=$('#gallery'), gb=$('#galBar');
  if(g){
    const step=()=>g.querySelector('figure').offsetWidth+20;
    $('#next').onclick=()=>g.scrollBy({left:step(),behavior:'smooth'});
    $('#prev').onclick=()=>g.scrollBy({left:-step(),behavior:'smooth'});
    function gBar(){
      const max=g.scrollWidth-g.clientWidth;
      const w=g.clientWidth/g.scrollWidth*100;
      gb.style.width=w+'%';
      gb.style.left=(max>0?g.scrollLeft/max*(100-w):0)+'%';
    }
    g.addEventListener('scroll',gBar,{passive:true}); gBar();
    let down=false,sx=0,sl=0,moved=0;
    g.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;down=true;moved=0;sx=e.clientX;sl=g.scrollLeft;g.classList.add('drag')});
    addEventListener('pointerup',()=>{down=false;g.classList.remove('drag')});
    addEventListener('pointermove',e=>{if(down){moved=Math.max(moved,Math.abs(e.clientX-sx));g.scrollLeft=sl-(e.clientX-sx)}});
    g.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation()}moved=0},true);
  }

  /* 6. カーソル追従・ホバーで大きく */
  const cur=$('#cursor'); let cx=0,cy=0,tx=0,ty=0;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
  (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  $$('a,button,.card,.gallery,.exp-card,.p-item').forEach(el=>{
    el.addEventListener('pointerenter',()=>cur.classList.add('big'));
    el.addEventListener('pointerleave',()=>cur.classList.remove('big'));
  });

  /* 7. カードが3Dにわずかに傾く */
  if(!reduce && matchMedia('(hover:hover)').matches){
    $$('.tilt').forEach(c=>{
      c.addEventListener('pointermove',e=>{
        const r=c.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        c.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave',()=>c.style.transform='');
    });
    /* 8. ボタンが磁石のようにカーソルに吸い付く */
    $$('.magnetic').forEach(b=>{
      b.addEventListener('pointermove',e=>{
        const r=b.getBoundingClientRect();
        b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;
      });
      b.addEventListener('pointerleave',()=>b.style.transform='');
    });
  }

  /* 9. スマホ用メニュー */
  const mb=$('#menuBtn');
  function setMenu(o){header.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);mb.setAttribute('aria-expanded',String(o))}
  mb.addEventListener('click',()=>setMenu(!header.classList.contains('open')));
  $$('header nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  /* 10. 写真スライドショー（自動で切り替わり、矢印・点・スワイプでも操作できる） */
  const sl=$('#slider');
  if(sl){
    const im=[...sl.querySelectorAll('.sl')], dots=$('#slDots'); let k=0, t;
    im.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',(i+1)+'枚目');b.onclick=()=>{go(i);auto()};dots.appendChild(b)});
    const ds=[...dots.children];
    function go(n){k=(n+im.length)%im.length;im.forEach((e,i)=>e.classList.toggle('on',i===k));ds.forEach((e,i)=>e.classList.toggle('on',i===k))}
    function auto(){clearInterval(t);if(!reduce)t=setInterval(()=>go(k+1),4500)}
    sl.querySelector('.prev').onclick=()=>{go(k-1);auto()};
    sl.querySelector('.next').onclick=()=>{go(k+1);auto()};
    let sx=null;
    sl.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
    sl.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){go(k+(d<0?1:-1));auto()}sx=null});
    go(0);auto();
  }

  /* 11. トップのグレードカード：3枚の画像が自動でふわっと切り替わる */
  if(!reduce){
    $$('.grades .card').forEach((card,ci)=>{
      const im=[...card.querySelectorAll('.fx')]; if(im.length<2)return; let k=0;
      setTimeout(()=>setInterval(()=>{im[k].classList.remove('on');k=(k+1)%im.length;im[k].classList.add('on')},1900),ci*1200);
    });
  }
})();
