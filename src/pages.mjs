import { company, courses, advancedCourse, advancedCourses } from './data/courses.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icon = id => `<svg class="icon" aria-hidden="true"><use href="#icon-${id}"></use></svg>`;

export function createPages(base) {
  const catalog = [...courses, advancedCourse];
  const link = (path, label, className = 'text-link') => `<a class="${className}" href="${base}${path}" data-link>${label}</a>`;
  const cta = () => `<section class="contact-section"><div class="container"><div class="compact-cta"><div><h2>필요한 교육을 문의하세요</h2><p>교육 대상·인원·희망 일정을 알려주세요.</p></div>${link('contact/', '교육 문의', 'button')}</div></div></section>`;
  const heading = (title, description = '') => `<header class="page-heading"><div class="container"><h1 tabindex="-1">${title}</h1>${description ? `<p>${description}</p>` : ''}</div></header>`;
  const cards = (headingTag = 'h2') => `<div class="course-grid">${catalog.map(course => `<article class="course-card"><div class="course-body">
    <${headingTag}>${course.title}</${headingTag}><p>${course.description}</p>
    ${link(`courses/${course.id}/`, `${course.title} 자세히 보기 ${icon('arrow')}`, 'course-link')}
    </div></article>`).join('')}</div>`;
  const courseNavigation = id => `<nav class="course-navigation" aria-label="다른 교육과정">${catalog.map(course => `<a href="${base}courses/${course.id}/" data-link${course.id === id ? ' aria-current="page"' : ''}>${escape(course.title)}</a>`).join('')}</nav>`;
  const modules = course => `<ol class="module-list">${course.modules.map((module, index) => `<li><span class="module-number">0${index + 1}</span><div><h3>${escape(module.title)}</h3><p>${escape(module.description)}</p></div></li>`).join('')}</ol>`;

  return [
    {
      id: 'home', path: '', nav: '', title: 'BlueSecurity EDU | 실무로 연결되는 보안교육',
      description: '블루시큐리티 보안교육. 인프라 진단, 웹 취약점 진단, 모의침투까지 실무에 필요한 보안 역량을 학습합니다.',
      content: `<section class="hero" aria-labelledby="hero-title"><div class="container hero-grid"><div class="hero-copy">
        <h1 id="hero-title" tabindex="-1">실무에 필요한 보안교육,<br><span>블루시큐리티에서 시작하세요.</span></h1>
        <p class="hero-description">인프라 진단 · 웹 취약점 진단 · 모의침투<br>기본 원리부터 실습, 결과 보고서 작성까지 학습합니다.</p>
        <div class="hero-actions">${link('courses/', `교육과정 살펴보기 ${icon('arrow')}`, 'button')}${link('contact/', '맞춤 교육 문의', 'button button-secondary')}</div>
        </div></div></section><section class="section" aria-labelledby="courses-title"><div class="container"><h2 id="courses-title" class="section-heading">교육과정</h2>${cards('h3')}</div></section>`,
    },
    {
      id: 'courses', path: 'courses/', nav: 'courses', title: '교육과정 | BlueSecurity EDU',
      description: '인프라 진단, 웹 취약점 진단, 모의침투와 기타 심화 교육의 내용을 확인하세요.',
      content: `${heading('교육과정')}<section class="section"><div class="container">${cards()}</div></section>${cta()}`,
    },
    ...courses.map(course => ({
      id: course.id, path: `courses/${course.id}/`, nav: 'courses', title: `${course.title} 교육 | BlueSecurity EDU`, description: course.description,
      content: `<header class="page-heading"><div class="container">
        <nav class="breadcrumbs" aria-label="현재 위치">${link('courses/', '교육과정')}<span aria-hidden="true">/</span><span aria-current="page">${course.title}</span></nav>
        <h1 tabindex="-1">${course.title}</h1><p>${course.description}</p>
        </div></header><section class="section course-detail"><div class="container">
        ${courseNavigation(course.id)}
        <div class="curriculum-panel"><div class="panel-intro"><h2>수강 안내</h2><dl class="course-facts">
        <div><dt>추천 대상</dt><dd>${course.audience}</dd></div><div><dt>선수 지식</dt><dd>${course.prerequisites}</dd></div><div><dt>학습 산출물</dt><dd>${course.outcome}</dd></div></dl>
        ${link(`contact/?course=${course.id}`, '교육 문의', 'button')}
        </div><div><h2 class="curriculum-title">커리큘럼</h2>${modules(course)}</div></div>
        </div></section>`,
    })),
    {
      id: advancedCourse.id, path: `courses/${advancedCourse.id}/`, nav: 'courses',
      title: `${advancedCourse.title} | BlueSecurity EDU`, description: advancedCourse.description,
      content: `<header class="page-heading"><div class="container">
        <nav class="breadcrumbs" aria-label="현재 위치">${link('courses/', '교육과정')}<span aria-hidden="true">/</span><span aria-current="page">${advancedCourse.title}</span></nav>
        <h1 tabindex="-1">${advancedCourse.title}</h1><p>${advancedCourse.description}</p>
        </div></header><section class="section course-detail"><div class="container">${courseNavigation(advancedCourse.id)}
        ${advancedCourses.map(course => `<article class="curriculum-panel advanced-curriculum" aria-labelledby="${course.id}-title"><div class="panel-intro">
        <h2 id="${course.id}-title">${escape(course.title)}</h2><p>${escape(course.description)}</p>
        ${link(`contact/?course=${course.id}`, '교육 문의', 'button')}
        </div>${modules(course)}</article>`).join('')}
        </div></section><section class="contact-section"><div class="container"><div class="compact-cta"><div><h2>그 밖의 교육 커리큘럼</h2><p>필요한 교육 주제와 대상을 알려주세요.</p></div>
        ${link('contact/?course=consultation', '커리큘럼 문의', 'button')}</div></div></section>`,
    },
    {
      id: 'faq', path: 'faq/', nav: 'faq', title: '자주 묻는 질문 | BlueSecurity EDU',
      description: '보안교육 수강 조건, 기업·기관 단체 교육과 일정·비용·교육 방식에 대한 안내입니다.',
      content: `${heading('자주 묻는 질문')}<section class="section"><div class="container"><div class="faq-list">
        <details><summary>보안 경험이 없어도 수강할 수 있나요?<span aria-hidden="true">+</span></summary><p>인프라·웹 진단은 기초부터 다룹니다. 운영체제, 네트워크 또는 웹의 기본 지식을 권장하며, 모의침투는 진단 경험자를 위한 과정입니다.</p></details>
        <details><summary>기업·기관 단체 교육이 가능한가요?<span aria-hidden="true">+</span></summary><p>교육 대상, 인원, 희망 일정과 학습 목표를 보내주시면 교육 범위와 운영 방식을 협의합니다.</p></details>
        <details><summary>일정·비용·교육 방식은 어떻게 확인하나요?<span aria-hidden="true">+</span></summary><p>개설 일정, 비용, 온라인·오프라인 여부와 실습 준비물은 교육 문의를 통해 확인해 주세요.</p></details>
        </div></div></section>${cta()}`,
    },
    {
      id: 'contact', path: 'contact/', nav: 'contact', title: '교육 문의 | BlueSecurity EDU',
      description: '블루시큐리티 보안교육의 과정 상담과 기업 맞춤 교육을 문의하세요.',
      content: `${heading('교육 문의', '교육 대상·인원·희망 일정을 알려주세요.')}<section class="contact-section"><div class="container"><div class="contact-grid">
        <div class="contact-copy"><h2>필요한 교육을 문의하세요</h2><p>관심 과정을 선택하고 이메일로 문의해 주세요.</p></div>
        <div class="contact-card"><label for="inquiry-course">관심 교육과정</label><select id="inquiry-course"><option value="consultation">과정 선택 상담 / 기업 맞춤 교육</option>${[...courses, ...advancedCourses].map(course => `<option value="${course.id}">${escape(course.title)}</option>`).join('')}</select>
        <a id="email-inquiry" class="button" href="mailto:${escape(company.email)}?subject=${encodeURIComponent('[BlueSecurity EDU] 교육 문의')}">이메일로 교육 문의</a>
        <p class="email-hint">이메일 앱에서 문의 초안을 엽니다.</p><div class="email-address"><a href="mailto:${escape(company.email)}" id="contact-email">${escape(company.email)}</a><button type="button" id="copy-email" hidden>주소 복사</button></div><span id="copy-status" class="copy-status" role="status" aria-live="polite"></span>
        </div></div></div></section>`,
    },
  ];
}
