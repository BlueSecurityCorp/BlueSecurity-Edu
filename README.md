# BlueSecurity EDU

블루시큐리티의 인프라 진단·웹 취약점 진단·모의침투 교육 소개 페이지입니다. 기존 BlueSecurity 홈페이지의 로고, Pretendard 서체, 색상과 레이아웃을 따릅니다.

## 실행

Node.js 22 이상에서 별도의 패키지 설치 없이 실행·빌드할 수 있습니다.

```sh
npm run dev
npm run build
npm run preview
```

로컬 주소: `http://127.0.0.1:4321/BlueSecurity-Edu/`

개발 서버는 페이지를 새로고침할 때 소스를 다시 빌드합니다. 빌드 결과는 `dist/`에 생성됩니다.

## 수정 위치

| 내용 | 파일 |
| --- | --- |
| 과정별 소개·대상·선수 지식·커리큘럼, 이메일·배포 URL | `src/data/courses.mjs` |
| 페이지 구성·FAQ·안내 문구 | `src/index.html` |
| 디자인·반응형 스타일 | `src/assets/styles.css` |
| 모바일 메뉴·과정 전환·이메일 문의 | `src/assets/app.js` |
| GitHub Pages 배포 | `.github/workflows/deploy.yml` |

교육 내용은 기본 구성안입니다. 일정, 비용, 시간과 운영 방식은 확정 정보가 없어 상담 안내로 연결합니다. 문의 버튼은 사용자의 이메일 앱에 초안을 열며, 사이트가 문의를 수집하거나 자동 발송하지 않습니다.

## GitHub Pages

- 저장소: `BlueSecurityCorp/BlueSecurity-Edu`
- 배포 브랜치: `main`
- 기본 배포 주소: `https://BlueSecurityCorp.github.io/BlueSecurity-Edu/`
- 회사 본 사이트의 `CNAME`은 사용하지 않습니다.

GitHub Desktop에서 처음 게시할 때:

1. 로컬 `BlueSecurity-Edu` 폴더를 열고 **Publish repository**를 선택합니다.
2. **Name**은 `BlueSecurity-Edu`, **Organization**은 `BlueSecurityCorp`로 지정하고 **Keep this code private**를 해제합니다.
3. **Publish Repository**를 누릅니다. 원격 저장소 생성과 업로드, `origin` 연결이 함께 처리됩니다.
4. GitHub 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 선택합니다.
5. **Actions → Deploy to GitHub Pages → Run workflow**로 배포합니다. Pages 설정 전 최초 실행이 실패했더라도 이 단계에서 다시 실행할 수 있습니다.

저장소를 웹에서 직접 생성하는 경우:

1. **BlueSecurityCorp** 조직에 빈 공개 저장소 `BlueSecurity-Edu`를 생성합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. 이 프로젝트의 `main` 브랜치를 해당 저장소에 push합니다.
4. **Actions → Deploy to GitHub Pages**의 배포 성공을 확인합니다.

```sh
git remote add origin https://github.com/BlueSecurityCorp/BlueSecurity-Edu.git
git push -u origin main
```

실제 GitHub 저장소를 생성한 뒤에만 `origin`을 연결합니다. `origin`이 이미 설정되어 있다면 `git remote -v`로 대상이 `BlueSecurityCorp/BlueSecurity-Edu`인지 확인합니다. 이후 `main`에 push하면 자동으로 빌드·배포됩니다. 빌드에는 외부 패키지나 저장소 비밀값이 필요하지 않습니다. 저장소 이름 또는 도메인을 변경하면 `src/data/courses.mjs`의 `company.siteUrl`도 수정하세요.

워크플로는 GitHub의 [사용자 지정 Pages 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 따릅니다.

## 검증

```sh
npm ci
npm test
```

설치된 Edge 또는 Chrome을 사용합니다. 다른 위치의 Chromium 계열 브라우저는 `BROWSER_PATH` 환경변수로 지정할 수 있습니다.

검증 항목: GitHub Pages 하위 경로의 정적 파일, 내부 링크, 과정 전환과 키보드 탐색, 직접 링크 새로고침, 이메일 초안, 클립보드 성공·실패, FAQ, 320·390·768·1024·1440px 화면, 접근성 검사, JavaScript 비활성화 시 기본 기능. 화면 캡처는 `.artifacts/`에 저장됩니다.

공유 이미지 재생성은 `npm run preview` 실행 중 `node scripts/generate-og.mjs`로 진행한 다음 다시 빌드합니다.

## 사용 자산

- BlueSecurity 로고: 기존 회사 홈페이지에 공개된 원본 워드마크.
- Pretendard Variable: 기존 BlueSecurity 프로젝트의 폰트. 라이선스는 `src/assets/Pretendard-LICENSE.txt`에 포함.
- 파비콘 및 색상: 기존 BlueSecurity 프로젝트 기준.

회사 로고의 권리는 BlueSecurity에 있습니다.
