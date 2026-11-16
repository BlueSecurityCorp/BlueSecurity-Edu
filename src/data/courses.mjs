export const company = {
  name: 'BlueSecurity',
  email: 'blue@bluesecurity.online',
  website: 'https://www.bluesecurity.online',
  siteUrl: 'https://BlueSecurityCorp.github.io/BlueSecurity-Edu/',
};

export const advancedCourse = {
  id: 'advanced', label: 'ADVANCED SECURITY', title: '기타 심화 교육',
  description: 'CI/CD·소프트웨어 공급망과 바이브코딩 등 개발·배포 과정의 보안을 학습합니다.',
};

export const advancedCourses = [
  {
    id: 'cicd-supply-chain', title: 'CI/CD·소프트웨어 공급망 보안',
    description: 'CI/CD 파이프라인과 의존성, 빌드·배포 산출물의 보안을 점검합니다.',
    modules: [
      { title: '저장소와 파이프라인 접근 통제', description: '코드 검토, 워크플로 권한, 외부 입력과 실행 환경의 보안 점검' },
      { title: '비밀정보와 배포 인증', description: '자격증명 관리, 최소 권한, OIDC 기반 배포 인증과 허용 조건 검증' },
      { title: '의존성과 소프트웨어 구성요소', description: '패키지 출처와 취약점 확인, SBOM 작성, 보안 검사와 배포 조건 연결' },
      { title: '산출물 검증과 안전한 배포', description: '빌드 출처와 무결성 확인, 배포·복구 실습, 개선 결과 정리' },
    ],
  },
  {
    id: 'vibe-coding-security', title: '바이브코딩 보안',
    description: 'AI가 생성한 코드의 취약점과 데이터 접근 권한, 개발 도구의 보안을 점검합니다.',
    modules: [
      { title: '보안 요구사항과 생성 코드 검토', description: '역할·데이터 소유권 정의, 코드 변경과 의존성 검토, 요청 범위 밖 수정 확인' },
      { title: '인증·인가와 데이터 보호', description: '서버 측 권한 검사, 사용자 간 데이터 격리, 입력 처리와 비밀정보 노출 점검' },
      { title: 'AI 도구와 에이전트 권한', description: '프롬프트 인젝션, MCP 도구의 파일·명령·네트워크 접근 범위 검증' },
      { title: '보안 테스트와 배포 전 검증', description: '취약점 수정, 회귀 테스트, 실행 결과 확인과 배포 판단' },
    ],
  },
];

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
