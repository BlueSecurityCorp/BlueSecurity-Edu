const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
document.documentElement.classList.add('js');

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
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 861px)').addEventListener('change', closeMenu);

const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('.curriculum-panel')];
const tablist = document.querySelector('.curriculum-tabs');
tablist.setAttribute('role', 'tablist');
tabs.forEach((tab) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', `curriculum-${tab.dataset.tab}`);
});
panels.forEach((panel) => {
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', panel.id.replace('curriculum-', 'tab-'));
  panel.tabIndex = 0;
});

function selectCourse(id, { focus = false } = {}) {
  if (!tabs.some((tab) => tab.dataset.tab === id)) return;
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus({ preventScroll: true });
  });
  panels.forEach((panel) => { panel.hidden = panel.id !== `curriculum-${id}`; });
}

function updateHash(id) {
  history.replaceState(null, '', `#curriculum-${id}`);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    selectCourse(tab.dataset.tab);
    updateHash(tab.dataset.tab);
  });
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectCourse(tabs[next].dataset.tab, { focus: true });
      updateHash(tabs[next].dataset.tab);
    }
  });
});
document.querySelectorAll('[data-course]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    selectCourse(link.dataset.course, { focus: true });
    updateHash(link.dataset.course);
    document.querySelector('#curriculum').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
});
function syncHash() {
  const course = location.hash.replace('#curriculum-', '');
  selectCourse(tabs.some((tab) => tab.dataset.tab === course) ? course : tabs[0].dataset.tab);
}
syncHash();
addEventListener('hashchange', () => {
  if (location.hash.startsWith('#curriculum-')) syncHash();
});
// Hidden deep-linked panels must be selected before restoring the anchor position.
if (location.hash.startsWith('#curriculum-')) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());

const courseSelect = document.querySelector('#inquiry-course');
const emailLink = document.querySelector('#email-inquiry');
const email = document.querySelector('#contact-email').textContent.trim();
function updateInquiry() {
  const course = courseSelect.selectedOptions[0].textContent;
  const subject = `[BlueSecurity EDU] ${course} 문의`;
  const body = `안녕하세요. 블루시큐리티 교육을 문의합니다.\n\n관심 과정: ${course}\n교육 대상 / 소속:\n교육 인원:\n현재 경험 / 수준:\n희망 일정:\n희망 교육 방식 (온라인 / 오프라인):\n학습 목표 및 문의 내용:\n`;
  emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
courseSelect.addEventListener('change', updateInquiry);
document.querySelectorAll('[data-inquiry-course]').forEach((link) => {
  link.addEventListener('click', () => {
    courseSelect.value = link.dataset.inquiryCourse;
    updateInquiry();
  });
});
updateInquiry();
const copyButton = document.querySelector('#copy-email');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    status.textContent = '이메일 주소를 복사했습니다.';
  } catch {
    status.textContent = '자동 복사가 제한되어 있습니다. 위 이메일 주소를 직접 선택해 복사해 주세요.';
  }
});
