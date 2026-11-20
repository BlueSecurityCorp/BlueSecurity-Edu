export const company = {
  name: 'BlueSecurity',
  email: 'blue@bluesecurity.online',
  website: 'https://www.bluesecurity.online',
  siteUrl: 'https://edu.bluesecurity.online/',
};

export const privacyCourse = {
  id: 'privacy-training', title: '개인정보보호 의무교육',
  description: '개인정보 취급자를 위한 1·2·4시간 교육으로, 처리 원칙과 보호조치, 유출 대응을 익힙니다.',
  formats: [
    {
      hours: 1, title: '1시간 기본교육',
      audience: '개인정보를 취급하는 직원과 수탁업체 실무자',
      modules: [
        { title: '개인정보와 취급자의 역할', minutes: 10, description: '개인정보 식별, 민감정보·고유식별정보, 업무 목적과 취급 범위' },
        { title: '수집부터 파기까지의 기본 원칙', minutes: 15, description: '수집·이용 근거, 최소 수집, 제공 전 확인, 보유기간과 파기' },
        { title: '일상 업무의 안전한 취급', minutes: 15, description: '이메일·공유 링크·계정·출력물 관리, 외부 서비스와 AI 입력 전 확인' },
        { title: '권리 요청과 유출 의심 상황', minutes: 15, description: '권리 요청 접수, 오발송·분실 시 내부 보고, 확산 방지와 증거 보존' },
        { title: '확인 문제와 질의응답', minutes: 5, description: '수집·공유·사고 대응 확인 문제와 해설' },
      ],
    },
    {
      hours: 2, title: '2시간 사례교육',
      audience: '인사·총무·영업·마케팅·고객지원 등 개인정보 취급 부서',
      modules: [
        { title: '개인정보 처리 원칙과 업무 책임', minutes: 15, description: '개인정보 구분, 처리 근거, 취급자·담당자 역할과 업무별 처리 흐름' },
        { title: '수집 항목과 동의·안내 점검', minutes: 25, description: '최소 수집, 필수·선택 항목, 보유기간, 신청서·동의서 점검 사례' },
        { title: '보관·공유·파기와 보호조치', minutes: 25, description: '접근권한, 파일 전달·암호화, 공유 설정, 파기 대상과 이력 점검' },
        { title: '위탁·제공과 외부 서비스 이용', minutes: 20, description: '처리위탁·제3자 제공 구분, 클라우드·생성형 AI 이용 사례' },
        { title: '정보주체 권리와 유출 대응', minutes: 25, description: '회원 탈퇴·삭제 요청과 고객 명단 오발송의 처리 순서·보고 내용 작성' },
        { title: '확인 평가와 업무 적용', minutes: 10, description: '사례 문제 풀이, 업무 점검표와 개선 행동 작성' },
      ],
    },
    {
      hours: 4, title: '4시간 실무교육',
      audience: '개인정보 보호책임자·담당자, 부서별·수탁업체 관리 담당자',
      modules: [
        { title: '처리 흐름과 관리체계', minutes: 25, description: '처리 근거, 역할과 책임, 내부 관리계획, 개인정보 처리 흐름표 작성' },
        { title: '수집·동의·처리방침 점검', minutes: 40, description: '신청서·동의서·처리방침을 실제 업무와 대조하고 수정안 작성' },
        { title: '위탁·제공·국외 이전 관리', minutes: 30, description: '외부 서비스의 처리 유형 분류, 위탁계약·감독, 국외 이전 확인사항' },
        { title: '안전성 확보조치 점검', minutes: 45, description: '계정·권한·공유 설정·접속기록을 검토하고 보호조치 개선안 작성' },
        { title: '정보주체 권리 요청 처리', minutes: 25, description: '본인 확인, 열람·삭제·처리정지, 보존 의무와 제한 사유 검토' },
        { title: '개인정보 유출 대응 훈련', minutes: 55, description: '공개 링크 사고의 초동 보고·범위 조사, 통지·신고 요건과 기한 검토' },
        { title: '결과 검토와 개선 계획', minutes: 20, description: '판단 근거 검토, 조치 우선순위·담당자·기한과 확인 방법 작성' },
      ],
    },
  ],
};

export const advancedCourse = {
  id: 'advanced', title: '기타 심화 교육',
  description: 'CI/CD·소프트웨어 공급망, 바이브코딩 보안과 개인정보보호를 다룹니다.',
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
  {
    id: 'privacy-protection', title: '개인정보보호',
    description: '개인정보 수집부터 파기까지 보호조치를 점검하고, 정보주체 권리 보장과 유출 대응 절차를 익힙니다.',
    modules: [
      { title: '개인정보 처리 원칙과 생애주기', description: '수집·이용 근거, 최소 수집, 보유기간과 파기, 개인정보 처리 흐름 정리' },
      { title: '처리방침과 위탁·제공 관리', description: '처리방침·동의서 점검, 처리위탁과 제3자 제공 구분, 국외 이전 요건 검토' },
      { title: '안전성 확보조치 점검', description: '내부 관리계획, 접근권한·접근통제, 암호화·접속기록과 물리적 보호조치 점검' },
      { title: '정보주체 권리와 유출 대응', description: '열람·정정·삭제·처리정지 요청 처리, 유출 대응·통지·신고 절차 실습' },
    ],
  },
];

// 교육 운영 정보가 확정되면 이 파일과 src/pages.mjs의 안내 문구를 함께 갱신합니다.
export const courses = [
  {
    id: 'infrastructure', number: '01', title: '인프라 진단',
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
    id: 'web', number: '02', title: '웹 취약점 진단',
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
    id: 'pentest', number: '03', title: '모의침투',
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
