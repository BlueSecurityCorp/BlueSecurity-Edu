export const company = {
  name: 'BlueSecurity',
  email: 'blue@bluesecurity.online',
  website: 'https://www.bluesecurity.online',
  siteUrl: 'https://BlueSecurityCorp.github.io/BlueSecurity-Edu/',
};

// 교육 운영 정보가 확정되면 이 파일과 src/pages.mjs의 안내 문구를 함께 갱신합니다.
export const courses = [
  {
    id: 'infrastructure', number: '01', label: 'INFRASTRUCTURE', title: '인프라 진단',
    subtitle: '안전한 시스템의 시작, 설정을 읽는 힘',
    description: '서버와 네트워크의 보안 설정을 점검하고, 취약한 구성의 원인부터 조치 방법까지 학습합니다.',
    audience: '시스템·네트워크 운영자, 인프라 보안 담당자, 기술 진단을 시작하는 분',
    prerequisites: '운영체제의 기본 명령어와 TCP/IP 기초 지식을 권장합니다.',
    outcome: '점검 근거와 개선 방향을 담은 인프라 진단 보고서',
    goal: '설정값을 확인하는 것에서 한 걸음 더. 왜 취약한지 설명하고, 서비스 운영을 고려한 조치안을 작성합니다.',
    modules: [
      { title: '인프라 구조와 진단 기준', description: '시스템 구성 파악, 자산 식별, 점검 범위와 기준 수립' },
      { title: 'Linux · Windows 보안 점검', description: '계정과 권한, 파일 접근 통제, 서비스 설정, 로그 관리' },
      { title: '네트워크 · 주요 서비스 점검', description: '접근 제어, 불필요한 서비스, 관리 인터페이스와 구성 검토' },
      { title: '결과 분석과 개선안 작성', description: '점검 증적 정리, 위험도 판단, 조치 가이드와 재점검' },
    ],
  },
  {
    id: 'web', number: '02', label: 'WEB SECURITY', title: '웹 취약점 진단',
    subtitle: '요청과 응답 사이, 취약점의 원리를 발견하다',
    description: '웹 애플리케이션의 동작을 이해하고, 취약점의 발견·검증·개선으로 이어지는 진단 과정을 익힙니다.',
    audience: '웹 개발자, 애플리케이션 보안 담당자, 웹 취약점 진단 입문자',
    prerequisites: '웹 서비스의 동작 방식과 HTML, HTTP에 대한 기초 이해를 권장합니다.',
    outcome: '재현 과정과 수정 권고를 담은 웹 취약점 진단 보고서',
    goal: '도구의 결과를 해석하고, 실제 보안 영향까지 검증합니다. 취약점의 원인을 이해해 개발 관점의 개선안으로 연결합니다.',
    modules: [
      { title: '웹 구조와 진단 환경 이해', description: 'HTTP 요청·응답, 쿠키와 세션, 프록시 기반 트래픽 분석' },
      { title: '주요 웹 취약점의 원리', description: '입력값 검증, SQL Injection, XSS, 파일 처리 취약점 이해' },
      { title: '인증 · 인가와 API 보안', description: '접근 통제, 세션 관리, API 권한 검증과 비즈니스 로직 점검' },
      { title: '취약점 검증과 보고서 작성', description: '실습 환경에서의 재현, 영향 분석, 시큐어 코딩 관점의 조치안' },
    ],
  },
  {
    id: 'pentest', number: '03', label: 'PENETRATION TESTING', title: '모의침투',
    subtitle: '개별 취약점을 넘어, 공격의 흐름을 이해하다',
    description: '허가된 실습 환경에서 공격 시나리오를 설계하고, 침투 경로와 비즈니스 영향을 종합적으로 분석합니다.',
    audience: '취약점 진단 경험자, 모의침투 역량을 넓히려는 보안 실무자',
    prerequisites: 'Linux·네트워크 기초와 웹 취약점 진단 경험을 권장합니다.',
    outcome: '공격 경로와 방어 개선안을 연결한 시나리오 기반 결과 보고서',
    goal: '단일 취약점을 찾는 데서 멈추지 않습니다. 여러 위험이 연결되는 과정을 이해하고, 조직이 우선 대응할 지점을 도출합니다.',
    modules: [
      { title: '모의침투 계획과 수행 원칙', description: '허가 범위, 수행 규칙, 시나리오와 종료 조건 정의' },
      { title: '정보 수집과 공격 표면 분석', description: '실습 자산의 서비스 식별, 노출 지점 분석, 검증 가설 수립' },
      { title: '시나리오 기반 침투 실습', description: '격리된 실습 환경에서 취약점 연계, 권한 경계와 공격 경로 검증' },
      { title: '영향 분석과 방어 전략', description: '수행 증적 정리, 탐지·대응 관점의 분석, 개선 우선순위 제안' },
    ],
  },
];
