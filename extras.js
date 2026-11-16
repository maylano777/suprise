(function () {
  var PASSWORD = "18112009";
  var gate = document.getElementById("gate");
  var input = document.getElementById("gate-input");
  var msg = document.getElementById("gate-msg");
  var card = gate.querySelector(".gate-card");
  document.body.style.overflow = "hidden";

  function tryOpen() {
    if (input.value.trim().toLowerCase() === PASSWORD) {
      gate.classList.add("hide");
      document.body.style.overflow = "";
      setTimeout(function () { gate.remove(); }, 500);
    } else {
      msg.textContent = "Hmm, belum bener nih 🥺";
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
    }
  }
  document.getElementById("gate-btn").addEventListener("click", tryOpen);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") tryOpen(); });
})();
/* extras.js — taruh SETELAH <script src="script.js"></script> */
(function(){
  // GANTI dengan username Instagram-mu (tanpa @). Kalau kosong, tombol balas tidak muncul.
  const IG_USERNAME = '1andusk';

  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ===== 1. Amplop pembuka ===== */
  const env = document.createElement('div');
  env.className = 'envelope-screen';
  env.innerHTML =
    '<div class="env-wrap">' +
      '<p class="env-to">Untuk</p>' +
      '<p class="env-name">Sekar</p>' +
      '<button type="button" class="envelope" aria-label="Buka amplop">' +
        '<span class="env-back"></span><span class="env-letter"></span>' +
        '<span class="env-front"></span><span class="env-flap"></span>' +
        '<span class="env-seal">17</span>' +
      '</button>' +
      '<p class="env-hint">ketuk amplopnya</p>' +
    '</div>';
  document.body.appendChild(env);

  const envBtn = env.querySelector('.envelope');
  let opened = false;
  envBtn.addEventListener('click', function(){
    if (opened) return;
    opened = true;
    env.classList.add('is-open');

    // Ketukan ini sekaligus jadi izin untuk memutar musik
    const audio = document.getElementById('bgm');
    if (audio) {
      audio.play().then(function(){
        if (typeof setPlayingUI === 'function') setPlayingUI(true);
      }).catch(function(){});
    }
    setTimeout(function(){
      document.body.classList.add('opened');
      env.classList.add('is-leaving');
    }, 1700);
    setTimeout(function(){ env.remove(); }, 2700);
  });
  envBtn.focus({ preventScroll: true });

  /* ===== 2. Ombak di bawah video ===== */
  const cap = document.querySelector('.video-caption');
  if (cap) {
    const wave = document.createElement('div');
    wave.className = 'wave-anim';
    wave.setAttribute('aria-hidden', 'true');
    cap.after(wave);
  }

  /* ===== 3. Kue 17 lilin ===== */
  const TOTAL = 17;
  const sec = document.createElement('section');
  sec.className = 'cake-section fade-el';
  sec.innerHTML =
    '<p class="cake-title">Satu hal lagi, Sekar</p>' +
    '<p class="cake-sub">Ada tujuh belas lilin di sini. Padamkan satu per satu, atau tiup lewat mikrofon. Jangan lupa simpan satu permintaan.</p>' +
    '<div class="cake">' +
      '<div class="candles"></div>' +
      '<div class="cake-top"></div>' +
      '<div class="cake-base">17</div>' +
    '</div>' +
    '<p class="cake-count" aria-live="polite"></p>' +
    '<button type="button" class="mic-btn">Tiup lewat mikrofon</button>' +
    '<div class="cake-end" hidden>' +
      '<p class="cake-wish">Semoga permintaanmu didengar semesta. Selamat ulang tahun, Sekar.</p>' +
    '</div>';

  const anchor = document.querySelector('.footer-note');
  if (anchor) anchor.after(sec);
  else (document.querySelector('.letter-card') || document.body).appendChild(sec);

  const candlesBox = sec.querySelector('.candles');
  const countEl = sec.querySelector('.cake-count');
  const micBtn = sec.querySelector('.mic-btn');
  const endBox = sec.querySelector('.cake-end');

  for (let i = 1; i <= TOTAL; i++) {
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'candle';
    c.setAttribute('aria-label', 'Padamkan lilin ' + i);
    c.innerHTML = '<span class="flame"></span><span class="smoke"></span>';
    c.addEventListener('click', function(){ snuff(c); });
    candlesBox.appendChild(c);
  }

  if (IG_USERNAME) {
    const a = document.createElement('a');
    a.className = 'ig-btn';
    a.href = 'https://ig.me/m/' + encodeURIComponent(IG_USERNAME);
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Balas lewat Instagram';
    endBox.appendChild(a);
  }

  const lit = function(){ return candlesBox.querySelectorAll('.candle:not(.is-out)'); };
  function updateCount(){
    const n = lit().length;
    countEl.textContent = n === 0 ? 'Semua lilin sudah padam.'
      : n === TOTAL ? TOTAL + ' lilin menyala'
      : 'Tersisa ' + n + ' lilin';
  }
  function snuff(c){
    if (c.classList.contains('is-out')) return;
    c.classList.add('is-out');
    c.setAttribute('aria-label', 'Lilin sudah padam');
    updateCount();
    if (lit().length === 0) finish();
  }
  let finished = false;
  function finish(){
    if (finished) return;
    finished = true;
    micBtn.hidden = true;
    endBox.hidden = false;
    confetti();
    setTimeout(function(){ endBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 400);
  }
  updateCount();

  /* Tiup lewat mikrofon */
  micBtn.addEventListener('click', async function(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const an = ac.createAnalyser();
      an.fftSize = 512;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      micBtn.disabled = true;
      micBtn.textContent = 'Tiup sekarang…';
      let last = 0;
      (function loop(now){
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++){ const d = (buf[i] - 128) / 128; sum += d * d; }
        if (Math.sqrt(sum / buf.length) > 0.15 && now - last > 110) {
          const L = lit();
          if (L.length) snuff(L[Math.floor(Math.random() * L.length)]);
          last = now;
        }
        if (lit().length) requestAnimationFrame(loop);
        else { stream.getTracks().forEach(function(t){ t.stop(); }); ac.close(); }
      })(0);
    } catch (e) {
      micBtn.textContent = 'Mikrofon tidak bisa dipakai, ketuk lilinnya saja';
      micBtn.disabled = true;
    }
  });

  /* Konfeti */
  function confetti(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const cols = ['#e8b571', '#f2d5a3', '#f4f2ea', '#5a7fa0', '#ffd27a'];
    const ps = Array.from({ length: 140 }, function(){
      return {
        x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .55,
        vx: (Math.random() - .5) * 11, vy: -Math.random() * 13 - 4,
        s: Math.random() * 6 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
        c: cols[Math.floor(Math.random() * cols.length)]
      };
    });
    let t = 0;
    (function frame(){
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(function(p){
        p.vy += .28; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (++t < 240) requestAnimationFrame(frame); else cv.remove();
    })();
  }

  /* Fade-in untuk bagian kue (observer di script.js sudah jalan sebelum elemen ini ada) */
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { threshold: .15 });
  io.observe(sec);
})();
