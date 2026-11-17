// Linea 소개 사이트
(() => {
  const REPO = 'Saynotrue/Linea';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ───────── 다운로드 링크: GitHub 최신 릴리스의 파일로 연결 ─────────
  //   (파일 이름에 버전이 들어 있어 최신 릴리스 정보를 받아 맞춤. 실패하면 릴리스 페이지로 그대로 둠)
  const ASSET_PATTERNS = {
    'linea-mac': /^Linea-[\d.]+-arm64\.dmg$/,
    'linea-win-setup': /^Linea[. ]Setup[. ][\d.]+\.exe$/,
    'linea-win-portable': /^Linea[. ][\d.]+\.exe$/,
    'player-mac': /^Linea[. ]Player-[\d.]+-arm64\.dmg$/,
    'player-win-setup': /^Linea[. ]Player[. ]Setup[. ][\d.]+\.exe$/,
    'player-win-portable': /^Linea[. ]Player[. ][\d.]+\.exe$/,
    connector: /^Linea-Connector-[\d.]+\.zip$/,
  };

  async function linkLatestRelease() {
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) return;
      const release = await res.json();
      const assets = release.assets || [];
      for (const [key, pattern] of Object.entries(ASSET_PATTERNS)) {
        const asset = assets.find(a => pattern.test(a.name));
        if (!asset) continue;
        document.querySelectorAll(`[data-asset="${key}"]`).forEach(el => { el.href = asset.browser_download_url; });
        document.querySelectorAll(`[data-name="${key}"]`).forEach(el => { el.textContent = `${asset.name} · ${formatSize(asset.size)}`; });
      }
      if (release.tag_name) document.querySelectorAll('[data-version]').forEach(el => { el.textContent = `최신 ${release.tag_name}`; });
    } catch (e) { /* 오프라인 등: 릴리스 페이지 링크 유지 */ }
  }
  const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${Math.round(bytes / 1024 / 1024)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`);
  linkLatestRelease();

  // ───────── Windows에서 열면 Windows 버튼을 먼저(강조) ─────────
  const isWindows = /Windows/i.test(navigator.userAgent);
  if (isWindows) {
    document.querySelectorAll('.hero-cta').forEach(row => {
      const mac = row.querySelector('[data-os="mac"]');
      const win = row.querySelector('[data-os="win"]');
      if (!mac || !win) return;
      mac.classList.replace('btn-primary', 'btn-glass');
      win.classList.replace('btn-glass', 'btn-primary');
      row.insertBefore(win, mac);
    });
  }

  // ───────── 설치 방식 탭 ─────────
  const choices = document.querySelectorAll('.choice');
  const panels = document.querySelectorAll('.steps-panel');
  choices.forEach(btn => btn.addEventListener('click', () => {
    choices.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
    panels.forEach(p => { p.hidden = p.dataset.panel !== btn.dataset.tab; });
  }));
  choices.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('is-active')));

  // ───────── 복사 버튼 ─────────
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }
  document.querySelectorAll('.copy').forEach(btn => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      showToast('복사했어요');
    } catch (e) {
      showToast('복사하지 못했어요. 직접 선택해 주세요');
    }
  }));

  // ───────── 스크롤하면 나타나기 ─────────
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  }
})();
