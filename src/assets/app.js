const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const siteBase = document.querySelector('meta[name="site-base"]').content;
const revision = document.querySelector('meta[name="build-revision"]').content;
const cache = new Map();
let renderedUrl = location.href;
let navigationId = 0;
let navigating = false;
let transition;
document.documentElement.classList.add('js');
history.scrollRestoration = 'manual';

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '메뉴 열기');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia('(min-width: 861px)').addEventListener('change', closeMenu);

function rememberScroll() {
  if (!navigating && renderedUrl === location.href) {
    history.replaceState({ ...history.state, scroll: [scrollX, scrollY] }, '', location.href);
  }
}
addEventListener('scroll', rememberScroll, { passive: true });
addEventListener('pagehide', rememberScroll);
rememberScroll();

function updateInquiry() {
  const select = document.querySelector('#inquiry-course');
  if (!select) return;
  const course = select.selectedOptions[0].textContent;
  const email = document.querySelector('#contact-email').textContent.trim();
  const subject = `[BlueSecurity EDU] ${course} 문의`;
  const body = `안녕하세요. 블루시큐리티 교육을 문의합니다.\n\n관심 과정: ${course}\n교육 대상 / 소속:\n교육 인원:\n현재 경험 / 수준:\n희망 일정:\n희망 교육 방식 (온라인 / 오프라인):\n학습 목표 및 문의 내용:\n`;
  document.querySelector('#email-inquiry').href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function initializePage(url) {
  const main = document.querySelector('#main');
  navigation.querySelectorAll('[data-nav]').forEach(link => {
    link.removeAttribute('aria-current');
    if (link.dataset.nav === main.dataset.nav) {
      link.setAttribute('aria-current', new URL(link.href).pathname === url.pathname ? 'page' : 'true');
    }
  });
  const select = document.querySelector('#inquiry-course');
  if (select) {
    const course = url.searchParams.get('course');
    select.value = [...select.options].some(option => option.value === course) ? course : 'consultation';
    updateInquiry();
    document.querySelector('#copy-email').hidden = false;
  }
}

function internalLink(target) {
  const link = target.closest?.('a[data-link]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || !url.pathname.startsWith(siteBase)) return;
  return url;
}

function loadPage(url) {
  // Query parameters select a course on the contact page; its HTML is shared.
  const key = url.pathname;
  if (!cache.has(key)) {
    const request = fetch(key, { headers: { Accept: 'text/html' }, signal: AbortSignal.timeout(10000) })
      .then(async response => {
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Page unavailable');
        return response.text();
      }).catch(error => { cache.delete(key); throw error; });
    cache.set(key, request);
    if (cache.size > 16) cache.delete(cache.keys().next().value);
  }
  return cache.get(key);
}

function prefetch(event) {
  const url = internalLink(event.target);
  if (url && !navigator.connection?.saveData) loadPage(url).catch(() => {});
}
document.addEventListener('pointerover', prefetch, { passive: true });
document.addEventListener('focusin', prefetch);

async function navigate(url, { mode = 'push', scroll = [0, 0] } = {}) {
  if (mode === 'push') rememberScroll();
  const id = ++navigationId;
  navigating = true;
  transition?.skipTransition();
  closeMenu();
  document.querySelector('#main').setAttribute('aria-busy', 'true');
  try {
    const html = await loadPage(url);
    if (id !== navigationId) return;
    const next = new DOMParser().parseFromString(html, 'text/html');
    const nextMain = next.querySelector('main[data-page]');
    if (!nextMain || next.querySelector('meta[name="build-revision"]')?.content !== revision) {
      throw new Error('A full navigation is required for this site version');
    }
    const update = () => {
      if (id !== navigationId) return;
      if (mode === 'push') history.pushState({ scroll: [0, 0] }, '', url);
      if (mode === 'replace') history.replaceState({ scroll: [0, 0] }, '', url);
      document.querySelector('#main').replaceWith(document.importNode(nextMain, true));
      document.title = next.title;
      for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]', 'link[rel="canonical"]']) {
        document.head.querySelector(selector).replaceWith(document.importNode(next.head.querySelector(selector), true));
      }
      renderedUrl = url.href;
      initializePage(url);
      document.querySelector('main h1').focus({ preventScroll: true });
      const anchor = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ left: scroll[0], top: scroll[1], behavior: 'instant' });
    };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition = document.startViewTransition(update);
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
      await transition.updateCallbackDone;
    } else update();
  } catch {
    if (id === navigationId) {
      // Normal document navigation also works when fetch fails or a new version is published.
      if (mode === 'push') location.assign(url.href);
      else location.replace(url.href);
    }
  } finally {
    if (id === navigationId) {
      navigating = false;
      document.querySelector('#main').removeAttribute('aria-busy');
      rememberScroll();
    }
  }
}

document.addEventListener('click', async event => {
  if (!event.target.closest('.site-header')) closeMenu();
  const copyButton = event.target.closest('#copy-email');
  if (copyButton) {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#contact-email').textContent.trim());
      status.textContent = '이메일 주소를 복사했습니다.';
    } catch {
      status.textContent = '자동 복사가 제한되어 있습니다. 위 이메일 주소를 직접 선택해 복사해 주세요.';
    }
    return;
  }
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = internalLink(event.target);
  if (!url) return;
  event.preventDefault();
  if (url.href === renderedUrl && !navigating) { closeMenu(); return; }
  await navigate(url);
});

document.addEventListener('change', event => {
  if (event.target.id !== 'inquiry-course') return;
  updateInquiry();
  const url = new URL(location.href);
  if (event.target.value === 'consultation') url.searchParams.delete('course');
  else url.searchParams.set('course', event.target.value);
  history.replaceState(history.state, '', url);
  renderedUrl = url.href;
});
addEventListener('popstate', event => navigate(new URL(location.href), { mode: 'none', scroll: event.state?.scroll || [0, 0] }));
initializePage(new URL(location.href));

// Preserve links shared before the site was split into separate pages.
const legacyRoutes = { '#courses': 'courses/', '#curriculum': 'courses/', '#approach': 'approach/', '#faq': 'faq/', '#contact': 'contact/', '#curriculum-infrastructure': 'courses/infrastructure/', '#curriculum-web': 'courses/web/', '#curriculum-pentest': 'courses/pentest/' };
if (location.pathname === siteBase && legacyRoutes[location.hash]) {
  navigate(new URL(siteBase + legacyRoutes[location.hash], location.origin), { mode: 'replace' });
}
