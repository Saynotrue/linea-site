// Linea 소개 사이트: 첫 화면의 전체화면 데모 플레이어
//   실제 앱처럼 동작: 재생/일시정지 · 이전/다음 곡 · 진행 바(누르기/끌기) · 가사 줄 누르기 · 번역 · 가사 창 · 소리 · 앨범 아트 → 영상
//   곡 · 가사 · 영상 · 음악은 모두 데모용 예시 (음악은 브라우저에서 바로 합성, 영상은 캔버스로 그림)
(() => {
  const demo = document.getElementById('demo');
  if (!demo) return;
  const $ = (id) => document.getElementById(id);
  const wrap = demo.closest('.mock-wrap');

  // ───────── 데모 곡 ─────────
  //   lines: [시간(초), 가사, 번역]. chords: 한 마디씩 [패드 음들(MIDI), 베이스 음]
  const SONGS = [
    {
      title: 'Afterglow Avenue', artist: 'Sample Artist', lang: 'en', bpm: 112, duration: 44,
      colors: {
        art: 'conic-gradient(from 210deg at 60% 40%, #f2788a, #b276e0, #74c0ef, #5fd08f, #f2788a)',
        c1: 'rgba(236, 101, 119, 0.75)', c2: 'rgba(139, 75, 184, 0.7)', c3: 'rgba(98, 174, 224, 0.55)', c4: 'rgba(63, 174, 110, 0.45)', base: '#1a1024',
      },
      video: { hue: 285, sun: ['#ffd27a', '#f2788a', '#b276e0'], grid: '236, 101, 160', beams: ['#f2788a', '#b276e0', '#74c0ef'] },
      chords: [[[57, 60, 64], 45], [[53, 57, 60], 41], [[55, 60, 64], 48], [[55, 59, 62], 43]],
      style: 'drive',
      lines: [
        [3.0, 'the city hums a quiet tune', '도시는 조용한 노래를 흥얼거려'],
        [6.6, 'we were singing in the rain', '우린 빗속에서 노래하고 있었지'],
        [10.2, 'every light turns into stars', '모든 불빛이 별이 되어'],
        [13.8, 'I keep your name inside my heart', '네 이름을 마음속에 간직해'],
        [17.4, 'afterglow along the avenue', '거리를 따라 남은 노을빛'],
        [21.0, "don't let this moment fade away", '이 순간이 흐려지지 않게'],
        [24.6, 'hold on, the night is young', '기다려, 밤은 아직 길어'],
        [28.2, "we'll dance until the morning comes", '아침이 올 때까지 춤추자'],
        [31.8, "so turn it up, don't look back", '소리를 높여, 뒤돌아보지 마'],
        [35.4, 'the avenue is ours tonight', '오늘 밤 이 거리는 우리 거야'],
        [39.4, '♪', ''],
      ],
    },
    {
      title: '紙飛行機と六月', artist: 'Mizuiro Sample', lang: 'ja', bpm: 96, duration: 42,
      colors: {
        art: 'conic-gradient(from 120deg at 40% 60%, #7fe0c0, #6fb7ff, #c9f27a, #7fe0c0)',
        c1: 'rgba(120, 220, 190, 0.6)', c2: 'rgba(90, 160, 255, 0.55)', c3: 'rgba(200, 240, 120, 0.4)', c4: 'rgba(80, 120, 200, 0.5)', base: '#0e1a24',
      },
      video: { hue: 195, sun: ['#fffbe0', '#a8f0d8', '#6fb7ff'], grid: '140, 230, 210', beams: ['#7fe0c0', '#6fb7ff', '#c9f27a'] },
      chords: [[[53, 57, 60, 64], 41], [[52, 55, 59, 62], 40], [[50, 53, 57, 60], 38], [[48, 52, 55, 59], 36]],
      style: 'light',
      lines: [
        [3.0, '窓の外で雨が止んだ', '창밖에서 비가 그쳤어'],
        [6.8, '君が折った紙飛行機', '네가 접은 종이비행기'],
        [10.6, '風に乗って遠くまで', '바람을 타고 저 멀리까지'],
        [14.4, '届かない言葉を乗せて', '전하지 못한 말을 싣고'],
        [18.2, '六月の空は青くて', '유월의 하늘은 파래서'],
        [22.0, '少しだけ泣きたくなった', '조금 울고 싶어졌어'],
        [25.8, 'それでも明日は来るから', '그래도 내일은 오니까'],
        [29.6, 'もう一度 笑ってみるよ', '다시 한번 웃어 볼게'],
        [33.6, '♪', ''],
      ],
    },
    {
      title: '새벽 세 시의 라디오', artist: '샘플 밴드', lang: 'ko', bpm: 84, duration: 36,
      colors: {
        art: 'conic-gradient(from 30deg at 50% 50%, #ffb36b, #ff7a59, #2b2f6b, #1b1e44, #ffb36b)',
        c1: 'rgba(255, 150, 90, 0.55)', c2: 'rgba(60, 70, 160, 0.6)', c3: 'rgba(255, 110, 90, 0.35)', c4: 'rgba(40, 40, 110, 0.6)', base: '#0d0d1f',
      },
      video: { hue: 235, sun: ['#fff1c9', '#ffb36b', '#ff7a59'], grid: '255, 160, 110', beams: ['#ffb36b', '#6b74ff', '#ff7a59'] },
      chords: [[[50, 53, 57, 64], 38], [[50, 53, 55, 59], 43], [[48, 52, 55, 59], 36], [[52, 55, 57, 60], 45]],
      style: 'lofi',
      lines: [
        [3.2, '잠들지 못한 새벽 세 시', ''],
        [7.4, '라디오에서 흘러나온 노래', ''],
        [11.6, '너도 이 노래를 듣고 있을까', ''],
        [15.8, '창문 너머 불 꺼진 거리', ''],
        [20.0, '괜찮다고 말해 주던 목소리', ''],
        [24.2, '오늘 밤은 조금 덜 외로워', ''],
        [29.0, '♪', ''],
      ],
    },
  ];

  // ───────── 상태 ─────────
  const state = {
    song: 0,
    offset: 4.6,           // 멈춘 시점의 곡 위치 (초). 처음에는 가사가 바로 보이도록 조금 진행된 위치에서 시작
    startedAt: performance.now(),
    playing: true,
    translate: true,
    lyrics: true,
    video: false,
    muted: true,
    volume: 0.7,
  };
  const song = () => SONGS[state.song];
  const now = () => performance.now();
  const songTime = () => Math.min(song().duration, state.playing ? state.offset + (now() - state.startedAt) / 1000 : state.offset);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ───────── 알림 (앱의 토스트처럼) ─────────
  const toast = $('demo-toast');
  let toastTimer = null;
  function showToast(text, ms = 1800) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
  }

  // ───────── 가사 ─────────
  //   앱처럼 지금 줄 위아래 2줄씩 정해진 자리에 두고, 줄이 바뀌면 한 칸씩 위로 (자리는 cqw: 실제 화면 20px = 1cqw)
  const SLOT_WITH_TR = { '-3': 19, '-2': 22.55, '-1': 26.15, 0: 29.7, 1: 36.5, 2: 39.9, 3: 44 };
  const SLOT_NO_TR = { '-3': 19, '-2': 22.55, '-1': 26.15, 0: 29.7, 1: 34.3, 2: 37.9, 3: 42 };
  const NOW_SCALE = 2.6 / 1.75;
  const track = $('lyric-track');
  let lineEls = [];
  let lines = [];
  let curIdx = -1;

  function buildLyrics(fadeIn) {
    lines = [[0, '♪', ''], ...song().lines];
    track.classList.add('is-swapping');
    track.innerHTML = '';
    lineEls = lines.map(([time, text, tr]) => {
      const el = document.createElement('div');
      el.className = 'lyric';
      el.textContent = text;
      if (tr) {
        const small = document.createElement('small');
        small.textContent = tr;
        el.appendChild(small);
      }
      // 가사 줄을 누르면 그 위치로 이동 (앱과 같음)
      el.addEventListener('click', () => seek(time + 0.01));
      track.appendChild(el);
      return el;
    });
    curIdx = -1;
    placeLyrics();
    void track.offsetWidth;
    track.classList.remove('is-swapping');
    if (fadeIn) track.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 285, easing: 'ease-out' });
  }

  function currentIndex(t) {
    let i = 0;
    while (i + 1 < lines.length && lines[i + 1][0] <= t) i++;
    return i;
  }

  function placeLyrics() {
    const t = songTime();
    const idx = currentIndex(t);
    if (idx === curIdx) return;
    curIdx = idx;
    const showTr = state.translate && song().lang !== 'ko' && !!lines[idx][2];
    const slots = showTr ? SLOT_WITH_TR : SLOT_NO_TR;
    lineEls.forEach((el, i) => {
      const off = i - idx;
      const visible = Math.abs(off) <= 2;
      el.classList.toggle('is-now', off === 0);
      el.style.opacity = visible ? 1 : 0;
      el.style.pointerEvents = visible ? 'auto' : 'none';
      el.style.transform = `translateY(${slots[Math.max(-3, Math.min(3, off))]}cqw) scale(${off === 0 ? NOW_SCALE : 1})`;
    });
    $('mini-lyric').textContent = lines[idx][1];
  }

  // ───────── 곡 정보 · 색 ─────────
  function applySong(fadeIn) {
    const s = song();
    $('demo-title').textContent = s.title;
    $('demo-artist').textContent = s.artist;
    $('mini-title').textContent = s.title;
    $('mini-artist').textContent = s.artist;
    for (const el of [demo, wrap]) {
      el.style.setProperty('--art', s.colors.art);
      for (const k of ['c1', 'c2', 'c3', 'c4', 'base']) el.style.setProperty(`--${k}`, s.colors[k]);
    }
    buildLyrics(fadeIn);
    if (state.translate && s.lang === 'ko' && fadeIn) showToast('한국어 가사라 번역하지 않아요');
  }

  // ───────── 재생 조작 ─────────
  function seek(t) {
    state.offset = Math.max(0, Math.min(song().duration - 0.05, t));
    state.startedAt = now();
    curIdx = -1;
    audio.reset();
    placeLyrics();
  }
  function setPlaying(playing) {
    if (playing === state.playing) return;
    state.offset = songTime();
    state.startedAt = now();
    state.playing = playing;
    demo.classList.toggle('is-paused', !playing);
    $('demo-play').setAttribute('aria-label', playing ? '일시정지' : '재생');
    audio.reset();
  }
  function changeSong(delta) {
    state.song = (state.song + delta + SONGS.length) % SONGS.length;
    state.offset = 0;
    state.startedAt = now();
    audio.reset();
    applySong(true);
  }

  $('demo-play').addEventListener('click', () => setPlaying(!state.playing));
  $('demo-next').addEventListener('click', () => changeSong(1));
  // 이전: 곡 앞부분(3초 이내)이면 이전 곡, 아니면 처음으로 (일반 플레이어와 같음)
  $('demo-prev').addEventListener('click', () => (songTime() > 3 ? seek(0) : changeSong(-1)));

  // 번역 켜기/끄기 (한국어 가사는 번역하지 않음)
  const btnTr = $('demo-tr');
  btnTr.classList.toggle('is-on', state.translate);
  btnTr.addEventListener('click', () => {
    state.translate = !state.translate;
    btnTr.classList.toggle('is-on', state.translate);
    btnTr.setAttribute('aria-pressed', state.translate);
    demo.classList.toggle('no-tr', !state.translate);
    if (state.translate && song().lang === 'ko') showToast('한국어 가사라 번역하지 않아요');
    curIdx = -1;
    placeLyrics();
  });

  // 가사 창 보이기/숨기기 (숨기면 곡 정보가 가운데로, 영상이면 크게)
  const btnLy = $('demo-ly');
  btnLy.addEventListener('click', () => {
    state.lyrics = !state.lyrics;
    btnLy.classList.toggle('is-on', state.lyrics);
    btnLy.setAttribute('aria-pressed', state.lyrics);
    demo.classList.toggle('no-lyrics', !state.lyrics);
  });

  // 진행 바: 누르거나 끌어서 이동, 마우스를 올리면 그 위치의 시간 표시
  const bar = $('demo-progress');
  const fill = bar.querySelector('.fill');
  const tip = $('demo-tip');
  let dragging = false;
  const ratioAt = (e) => {
    const r = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  };
  const showTip = (ratio) => {
    tip.textContent = fmt(ratio * song().duration);
    tip.style.left = `${ratio * 100}%`;
  };
  bar.addEventListener('pointermove', (e) => {
    showTip(ratioAt(e));
    if (dragging) seek(ratioAt(e) * song().duration);
  });
  bar.addEventListener('pointerdown', (e) => {
    dragging = true;
    bar.classList.add('is-drag');
    bar.setPointerCapture(e.pointerId);
    seek(ratioAt(e) * song().duration);
  });
  const endDrag = () => { dragging = false; bar.classList.remove('is-drag'); };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      seek(songTime() + (e.key === 'ArrowLeft' ? -5 : 5));
    }
  });

  // 키보드: 데모 위에 마우스가 있을 때만 (페이지 스크롤을 빼앗지 않게)
  let hovering = false;
  demo.addEventListener('pointerenter', () => { hovering = true; });
  demo.addEventListener('pointerleave', () => { hovering = false; });
  document.addEventListener('keydown', (e) => {
    if (!hovering || e.target.closest('input, textarea')) return;
    if (e.key === ' ') { e.preventDefault(); setPlaying(!state.playing); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); seek(songTime() + (e.key === 'ArrowLeft' ? -5 : 5)); }
  });

  // ───────── 소리: 데모 음악을 브라우저에서 합성 (Web Audio) ─────────
  //   처음에는 꺼져 있음 (사이트가 갑자기 소리를 내지 않게). 소리 버튼을 누르면 켜짐
  const audio = (() => {
    let ctx = null, master = null, analyser = null, session = null, noise = null;
    let scheduledUntil = 0; // 곡 시간 기준으로 여기까지 예약함
    const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

    function init() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = state.volume;
      const comp = ctx.createDynamicsCompressor();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.55;
      master.connect(comp).connect(analyser).connect(ctx.destination);
      // 하이햇·스네어용 잡음
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }

    // 예약한 소리를 한 묶음(session)으로 두고, 이동·일시정지·곡 변경 때는 묶음째 줄여 끔
    function reset() {
      if (!ctx) return;
      if (session) {
        const old = session;
        old.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
        setTimeout(() => old.disconnect(), 300);
      }
      session = ctx.createGain();
      session.connect(master);
      scheduledUntil = songTime();
    }

    function env(node, when, peak, attack, release) {
      node.gain.setValueAtTime(0.0001, when);
      node.gain.exponentialRampToValueAtTime(peak, when + attack);
      node.gain.exponentialRampToValueAtTime(0.0001, when + attack + release);
    }
    function tone(type, f, when, dur, peak, { attack = 0.01, filter = 0, detune = 0 } = {}) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = detune;
      const g = ctx.createGain();
      env(g, when, peak, attack, dur);
      if (filter) {
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = filter;
        o.connect(lp).connect(g);
      } else o.connect(g);
      g.connect(session);
      o.start(when);
      o.stop(when + attack + dur + 0.05);
    }
    function hit(when, hp, peak, dur) {
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hp;
      const g = ctx.createGain();
      env(g, when, peak, 0.002, dur);
      src.connect(f).connect(g).connect(session);
      src.start(when);
      src.stop(when + dur + 0.05);
    }
    function kick(when, peak = 0.9) {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(140, when);
      o.frequency.exponentialRampToValueAtTime(45, when + 0.12);
      const g = ctx.createGain();
      env(g, when, peak, 0.003, 0.28);
      o.connect(g).connect(session);
      o.start(when);
      o.stop(when + 0.35);
    }

    // 16분음표 하나 = step. 곡의 스타일에 따라 드럼·베이스·아르페지오 패턴을 다르게
    function step(s, n, when, intro) {
      const spb = 60 / s.bpm;
      const bar = Math.floor(n / 16), k = n % 16;
      const [pad, bass] = s.chords[bar % s.chords.length];
      if (k === 0) pad.forEach((m, i) => tone('sawtooth', freq(m), when, spb * 4, 0.035, { attack: 0.35, filter: 1100, detune: i % 2 ? 7 : -7 }));
      if (intro) return; // 전주: 패드만
      if (s.style === 'drive') {
        if (k % 4 === 0) kick(when);
        if (k === 4 || k === 12) hit(when, 1500, 0.28, 0.14);
        if (k % 2 === 1) hit(when, 7000, 0.07, 0.04);
        if (k % 2 === 0) tone('triangle', freq(bass + (k % 8 === 6 ? 12 : 0)), when, spb * 0.45, 0.32, { filter: 700 });
        if (k % 2 === 0) tone('square', freq(pad[(k / 2) % pad.length] + 12), when, spb * 0.35, 0.03, { filter: 2500 });
      } else if (s.style === 'light') {
        if (k === 0 || k === 10) kick(when, 0.7);
        if (k === 8) hit(when, 2000, 0.18, 0.12);
        if (k % 4 === 2) hit(when, 8000, 0.06, 0.03);
        if (k === 0 || k === 6 || k === 8) tone('triangle', freq(bass), when, spb * 0.9, 0.3, { filter: 600 });
        if (k % 2 === 0) tone('sine', freq(pad[(k / 2) % pad.length] + 24), when, spb * 0.6, 0.05);
      } else {
        // lofi: 느린 킥, 스윙 하이햇, 부드러운 건반
        if (k === 0 || k === 7) kick(when, 0.6);
        if (k === 8) hit(when, 1200, 0.16, 0.18);
        if (k % 4 === 0 || k % 4 === 3) hit(when + (k % 4 === 3 ? spb * 0.06 : 0), 6000, 0.045, 0.05);
        if (k === 0) tone('sine', freq(bass), when, spb * 3, 0.38, { filter: 400 });
        if (k === 0 || k === 6 || k === 10) pad.forEach(m => tone('triangle', freq(m + 12), when, spb * 0.8, 0.03, { attack: 0.02 }));
      }
    }

    // 매 프레임: 앞으로 0.15초 분량을 예약
    function tick() {
      if (!ctx || state.muted || !state.playing || ctx.state !== 'running') return;
      const s = song();
      const t = songTime();
      const stepLen = 60 / s.bpm / 4;
      const until = Math.min(t + 0.15, s.duration - 0.5);
      let n = Math.ceil(scheduledUntil / stepLen - 1e-6);
      for (; n * stepLen < until; n++) {
        const at = n * stepLen;
        if (at < t - 0.02) continue;
        step(s, n, ctx.currentTime + (at - t), at < s.lines[0][0] - 0.05);
      }
      scheduledUntil = Math.max(scheduledUntil, until);
    }

    async function setMuted(muted) {
      if (!muted) {
        init();
        if (ctx.state !== 'running') await ctx.resume();
        reset();
      } else if (ctx) {
        reset();
      }
    }
    function setVolume(v) { if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.03); }
    // 이퀄라이저용: 실제 소리의 주파수 세기 (소리가 꺼져 있으면 null)
    const bins = new Uint8Array(128);
    function spectrum() {
      if (!analyser || state.muted || !state.playing) return null;
      analyser.getByteFrequencyData(bins);
      return bins;
    }
    return { reset, tick, setMuted, setVolume, spectrum };
  })();

  const btnMute = $('demo-mute');
  const vol = $('demo-vol');
  async function setMuted(muted) {
    state.muted = muted;
    demo.classList.toggle('is-muted', muted);
    btnMute.setAttribute('aria-label', muted ? '소리 켜기' : '소리 끄기');
    await audio.setMuted(muted);
  }
  btnMute.addEventListener('click', () => setMuted(!state.muted));
  vol.addEventListener('input', () => {
    state.volume = vol.value / 100;
    audio.setVolume(state.volume);
    if (state.muted && state.volume > 0) setMuted(false);
    if (state.volume === 0 && !state.muted) setMuted(true);
  });
  demo.classList.add('is-muted');

  // ───────── 이퀄라이저 ─────────
  //   소리를 켜면 실제 소리의 주파수 세기로, 꺼져 있으면 박자에 맞춰 흉내 냄. 일시정지면 점으로
  const eqBars = [...document.querySelectorAll('#demo-eq i')];
  const miniBars = [...document.querySelectorAll('.mock-bar .mini-eq i')];
  const eqVals = new Array(10).fill(0);
  const BANDS = [[1, 2], [2, 3], [3, 5], [5, 8], [8, 12], [12, 18], [18, 26], [26, 38], [38, 55], [55, 80]];
  function updateEq(t, dt) {
    const bins = audio.spectrum();
    const s = song();
    const beat = (t * s.bpm / 60) % 1;
    for (let i = 0; i < 10; i++) {
      let target = 0;
      if (state.playing && t > 0.3) {
        if (bins) {
          const [a, b] = BANDS[i];
          let peak = 0;
          for (let k = a; k < b; k++) peak = Math.max(peak, bins[k]);
          target = Math.max(0, (peak - 60) / 170) * (1 + i * 0.12);
        } else {
          const kickPulse = Math.pow(1 - beat, 4) * (i < 3 ? 1 : 0.35);
          target = 0.25 + kickPulse * 0.7 + 0.3 * Math.abs(Math.sin(t * (2.1 + i * 0.73) + i * 1.7));
        }
      }
      const tau = target > eqVals[i] ? 45 : 110; // 올라갈 때 빠르게, 내려올 때 천천히 (앱과 같은 느낌)
      eqVals[i] += (target - eqVals[i]) * (1 - Math.exp(-dt / tau));
      eqBars[i].style.height = `${(0.45 + Math.min(1, eqVals[i]) * 1.45).toFixed(3)}cqw`;
    }
    miniBars.forEach((el, i) => { el.style.height = `${(4 + Math.min(1, eqVals[i + 1]) * 14).toFixed(1)}px`; });
  }

  // ───────── 앨범 아트 → 영상 ─────────
  const art = $('mock-art');
  const videoBox = $('mock-video');
  const hint = $('mock-hint');
  const cv = $('mv-canvas');
  const ctx2d = cv.getContext('2d');
  const bgCv = $('mv-bg');
  const bgCtx = bgCv.getContext('2d');
  let videoFadeUntil = 0;
  function setVideo(on) {
    state.video = on;
    demo.classList.toggle('is-video', on);
    hint.classList.add('is-hidden');
    if (!on) videoFadeUntil = now() + 950; // 사라지는 동안은 계속 그림
  }
  art.addEventListener('click', () => setVideo(true));
  videoBox.addEventListener('click', () => setVideo(false));

  // 데모 영상 한 장면 (t: 곡 시간 → 일시정지·이동도 영상에 그대로 반영)
  const W = cv.width, H = cv.height;
  const stars = Array.from({ length: 60 }, () => [Math.random() * W, Math.random() * H * 0.55, Math.random() * 1.2 + 0.3, Math.random() * 6]);
  function drawScene(t, v, bpm) {
    const c = ctx2d;
    const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * bpm / 60)), 8);
    const hue = v.hue + Math.sin(t * 0.15) * 20;
    const sky = c.createLinearGradient(0, 0, 0, H * 0.62);
    sky.addColorStop(0, `hsl(${hue - 40}, 60%, 8%)`);
    sky.addColorStop(1, `hsl(${hue}, 70%, ${22 + beat * 6}%)`);
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    for (const [x, y, r, p] of stars) {
      c.globalAlpha = 0.35 + 0.35 * Math.sin(t * 2 + p);
      c.fillStyle = '#fff';
      c.fillRect(x, y, r, r);
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'lighter';
    v.beams.forEach((color, i) => {
      c.save();
      c.translate(W * (0.2 + i * 0.3), -10);
      c.rotate(Math.sin(t * 0.7 + i * 2) * 0.45);
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      c.globalAlpha = 0.18 + beat * 0.2;
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(-6, 0); c.lineTo(6, 0); c.lineTo(70, H); c.lineTo(-70, H);
      c.fill();
      c.restore();
    });
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    const sunR = H * 0.27 * (1 + beat * 0.04);
    const cx = W / 2, cy = H * 0.6;
    const sun = c.createLinearGradient(0, cy - sunR, 0, cy + sunR);
    sun.addColorStop(0, v.sun[0]);
    sun.addColorStop(0.55, v.sun[1]);
    sun.addColorStop(1, v.sun[2]);
    c.save();
    c.beginPath();
    c.arc(cx, cy, sunR, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = sun;
    c.fillRect(cx - sunR, cy - sunR, sunR * 2, sunR * 2);
    c.fillStyle = `hsl(${hue}, 70%, 18%)`;
    for (let i = 0; i < 6; i++) c.fillRect(cx - sunR, cy + sunR * (0.05 + i * 0.16) + ((t * 6) % (sunR * 0.16)), sunR * 2, 2 + i * 1.2);
    c.restore();
    const horizon = H * 0.62;
    c.fillStyle = `hsl(${hue}, 50%, 5%)`;
    c.fillRect(0, horizon, W, H - horizon);
    c.strokeStyle = `rgba(${v.grid}, ${0.55 + beat * 0.35})`;
    c.lineWidth = 1;
    const speed = (t * bpm / 120) % 1;
    for (let i = 0; i < 12; i++) {
      const y = horizon + Math.pow((i + speed) / 12, 2.2) * (H - horizon);
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke();
    }
    for (let i = -12; i <= 12; i++) {
      c.beginPath(); c.moveTo(cx + i * 6, horizon); c.lineTo(cx + i * 70, H); c.stroke();
    }
    const glow = c.createLinearGradient(0, horizon - 14, 0, horizon + 10);
    glow.addColorStop(0, 'transparent');
    glow.addColorStop(0.6, `rgba(${v.grid}, ${0.35 + beat * 0.3})`);
    glow.addColorStop(1, 'transparent');
    c.fillStyle = glow;
    c.fillRect(0, horizon - 14, W, 24);
  }

  // ───────── 매 프레임 ─────────
  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(demo);
  let last = now();
  function frame() {
    const tNow = now();
    const dt = Math.min(100, tNow - last);
    last = tNow;
    // 곡이 끝나면 다음 곡
    if (state.playing && songTime() >= song().duration) changeSong(1);
    const t = songTime();
    audio.tick();
    if (visible) {
      placeLyrics();
      fill.style.width = `${(t / song().duration) * 100}%`;
      bar.setAttribute('aria-valuemax', Math.round(song().duration));
      bar.setAttribute('aria-valuenow', Math.round(t));
      bar.setAttribute('aria-valuetext', `${fmt(t)} / ${fmt(song().duration)}`);
      updateEq(t, dt);
      if (state.video || tNow < videoFadeUntil) {
        drawScene(t, song().video, song().bpm);
        bgCtx.drawImage(cv, 0, 0, bgCv.width, bgCv.height);
      }
    }
    requestAnimationFrame(frame);
  }

  applySong(false);
  requestAnimationFrame(frame);
})();
