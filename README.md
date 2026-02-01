<div align="center">

# 🔷 Gemini Usage CLI

**Google Gemini API 사용량을 추적하는 아름다운 터미널 대시보드**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[기능](#-기능) • [설치](#-설치) • [사용법](#-사용법) • [명령어](#-명령어) • [개발](#-개발)

</div>

---

## ✨ 기능

- 🎨 **Google 테마 UI** - Google 시그니처 색상을 적용한 아름다운 터미널 인터페이스
- 📊 **실시간 대시보드** - 토큰 사용량 및 API 요청 실시간 추적
- 🔄 **반응형 업데이트** - 새로운 사용 데이터 기록 시 자동 갱신
- 🛠️ **대화형 설정** - Antigravity 통합을 위한 간편한 설정 마법사
- 🔐 **안전한 설정 관리** - `conf`를 사용한 민감 정보의 로컬 저장
- 📦 **설정 불필요** - 기본값으로 바로 사용 가능
- ⚡ **빠르고 가벼움** - 최신 ESM 기반으로 최적화된 성능
- 🎯 **TypeScript 우선** - 완벽한 타입 지원으로 뛰어난 개발 경험

## 📦 설치

### 필수 요구사항
- Node.js >= 18
- npm 또는 yarn

### 의존성 설치
```bash
npm install
```

### 프로젝트 빌드
```bash
npm run build
```

## 🚀 사용법

### 빠른 시작
```bash
# 현재 사용량 조회
node dist/index.js scan

# 실시간 모니터링
node dist/index.js scan --watch

# 대화형 설정
node dist/index.js setup
```

## 📖 명령어

### `setup` - 대화형 설정

Antigravity AI 에이전트의 자동 로깅을 설정합니다.

```bash
node dist/index.js setup
```

**기능:**
- 쉬운 설정을 위한 대화형 프롬프트
- 프로젝트 레벨 또는 전역 설정 선택 가능
- 로깅 규칙이 포함된 `.antigravity/rules.md` 자동 생성
- 설정 완료 후 실시간 모니터링 시작

**예시:**
```bash
$ node dist/index.js setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚙️  Interactive Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
? Would you like to enable automatic logging for Antigravity? (Y/n)
? Where should this logging rule be applied?
  ❯ Current Project only (.antigravity/rules.md)
    Global (All projects - ~/.antigravity/rules.md)
```

---

### `scan` - 사용량 통계 조회

현재 Gemini API 사용량의 스냅샷을 표시합니다.

```bash
node dist/index.js scan
```

**출력 정보:**
- 총 소비 토큰 수
- 총 API 요청 횟수
- 마지막 활동 시간
- 현재 상태

**예시:**
```bash
$ node dist/index.js scan

    ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗
   ██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║
   ██║ ███╗ █████╗  ██╔████╔██║██║██╔██╗ ██║██║
   ██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║
   ╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
    ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Gemini Usage Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌───────────────────────────────────────────────┐
  │ Total Tokens   ⚡ 21.50K                      │
  │ Total Requests 📦 2                           │
  │ Last Activity  📅 2/1/2026                    │
  │ Status         🟢 Reactive (Watching Logs)    │
  └───────────────────────────────────────────────┘

  ✓ Scan complete!
```

---

### `scan --watch` - 실시간 모니터링

자동 업데이트로 Gemini 사용량을 실시간으로 모니터링합니다.

```bash
node dist/index.js scan --watch
# 또는
node dist/index.js scan -w
```

**기능:**
- 🔄 **자동 갱신** - 새로운 로그 작성 시 즉시 업데이트
- 💬 **대화형 명령어** - 모니터링 중 명령어 입력 가능
- 🎯 **파일 감시** - 효율적인 모니터링을 위한 `fs.watch()` 사용
- ⌨️ **키보드 단축키** - 간단한 명령어로 쉽게 제어

**대화형 명령어:**
- `/refresh` - 대시보드 수동 갱신
- `/help` - 사용 가능한 명령어 표시
- `Ctrl+C` (두 번) - 애플리케이션 종료

**예시:**
```bash
$ node dist/index.js scan --watch

  ● Dashboard is waiting for new usage records...
  Commands: [ /refresh, /help ] or Ctrl+C twice to stop
  
  command > /help
  
  Available Commands:
  /refresh - Force update the dashboard
  /help    - Show this help message
  Ctrl+C (x2) - Exit the application
```

---

### `auth` - 인증 (예시)

토큰으로 인증 테스트 (향후 API 통합을 위한 예시 명령어).

```bash
node dist/index.js auth --token YOUR_TOKEN
```

**예시:**
```bash
$ node dist/index.js auth --token sk_test_12345

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔐 Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Token recognized: sk_test_...
  Welcome back, User!
```

## 📁 프로젝트 구조

```
gemini_usage_cli/
├── src/
│   ├── index.ts              # 메인 CLI 진입점
│   └── lib/
│       ├── config.ts         # 설정 관리
│       ├── log-parser.ts     # 사용량 로그 파싱
│       ├── logger.ts         # 로깅 유틸리티
│       ├── setup-helper.ts   # 설정 마법사 헬퍼
│       └── ui.ts             # 터미널 UI 컴포넌트
├── dist/                     # 컴파일된 출력 (ESM)
├── docs/                     # 문서
├── package.json
└── tsconfig.json
```

## 🛠️ 개발

### 사용 가능한 스크립트

```bash
# 프로덕션용 빌드
npm run build

# 감시 모드로 개발
npm run dev

# CLI 실행
npm start
```

### 기술 스택

- **런타임**: Node.js >= 18
- **언어**: TypeScript 5.7
- **모듈 시스템**: ESM (ES Modules)
- **빌드 도구**: tsup
- **CLI 프레임워크**: Commander.js
- **UI 라이브러리**: chalk, inquirer, ora

### 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| chalk | ^5.3.0 | 터미널 색상 및 스타일링 |
| commander | ^12.1.0 | CLI 프레임워크 |
| conf | ^13.0.1 | 설정 관리 |
| inquirer | ^9.2.23 | 대화형 프롬프트 |
| ora | ^8.1.0 | 우아한 터미널 스피너 |
| string-width | ^7.2.0 | 문자열 너비 계산 |

## 📊 작동 원리

1. **로깅**: Antigravity AI 에이전트가 `~/.gemini/usage.jsonl`에 사용량 기록
2. **파싱**: CLI가 JSONL 형식의 로그를 읽고 파싱
3. **표시**: 아름다운 터미널 UI로 집계된 통계 표시
4. **감시**: 파일 감시자가 변경 사항 감지 후 자동 갱신

### 로그 형식

```jsonl
{"timestamp":"2026-02-01T06:00:00.000Z","project":"my-project","model":"gemini-2.0-flash","usage":{"input_tokens":1500,"output_tokens":800}}
```

## 🤝 Antigravity 통합

이 CLI는 Antigravity AI 에이전트와 원활하게 작동하도록 설계되었습니다. `setup`을 실행하면 Antigravity에게 사용량을 자동으로 기록하도록 지시하는 규칙 파일이 생성됩니다:

**프로젝트 레벨**: `.antigravity/rules.md`  
**전역**: `~/.antigravity/rules.md`

이 규칙은 Antigravity가 완료한 모든 중요한 작업이 `~/.gemini/usage.jsonl`에 기록되도록 보장합니다.

## 📝 라이선스

MIT © 2026

---

<div align="center">

**Gemini API 커뮤니티를 위해 ❤️로 제작**

[버그 신고](https://github.com/yourusername/gemini-usage-cli/issues) • [기능 요청](https://github.com/yourusername/gemini-usage-cli/issues)

</div>
