# Repository Guidelines

## Project Structure & Module Organization
- CLI 진입점: `src/index.ts`에서 `setup`, `scan`, `scan --watch`, `auth` 명령을 정의합니다.
- 공용 유틸: `src/lib/`에 UI(`ui.ts`), 로깅 헬퍼(`logger.ts`, `setup-helper.ts`), 로그 파서(`log-parser.ts`)가 있습니다.
- 빌드 산출물: `dist/`에 번들된 ESM CLI(`index.js`, 타입 선언)가 생성됩니다. 문서는 `docs/`에 위치합니다.

## Build, Test, and Development Commands
- `npm run build`: tsup으로 TypeScript를 ESM+d.ts 번들링하여 `dist/`에 출력.
- `npm run dev`: 감시 모드 빌드로 개발 시 빠른 피드백.
- `npm start`: 빌드된 `dist/index.js`를 실행.
- `node dist/index.js scan [-w]`: 사용량 로그 스냅샷 또는 실시간 감시 실행.
- `node dist/index.js setup`: 대화형 로깅 규칙 부트스트랩.

## Coding Style & Naming Conventions
- 언어: TypeScript(ESM). `strict` 옵션 활성화.
- 임포트: NodeNext 요구사항에 맞춰 로컬 파일에 `.js` 확장자를 명시합니다.
- 포매팅: 4-스페이스 인덴트, 간결한 함수/early return 선호.
- 문자열: 기존 코드와 동일하게 더블 쿼트를 기본 사용.
- UI: `src/lib/ui.ts`의 Google 테마 색상과 박스/이모지 패턴을 유지합니다.

## Testing Guidelines
- 현재 자동화 테스트는 없음. 추가 시 TS 친화적인 러너(Vitest/Jest)를 권장하며 `__tests__/` 혹은 모듈 옆 `.test.ts`로 배치합니다.
- 로그 파싱 엣지 케이스(파일 없음, 손상된 라인, 정렬되지 않은 타임스탬프)와 CLI 명령 동작을 우선 커버하세요.

## Commit & Pull Request Guidelines
- 커밋 메시지: 현재형, 간결하게(예: `Add watch reload guard`, `Refine log parsing`), 필요 시 스코프를 포함합니다.
- PR: 동기(문제/이슈)와 주요 변경점, 수동 테스트 노트를 요약합니다. 사용자 영향이 있는 경우 CLI 예제와 UI 출력 캡처(스크린샷/ASCII)를 포함하세요. 이슈 연동 시 링크를 추가합니다.

## Security & Configuration Tips
- 로그는 `~/.gemini/usage.jsonl`에 저장됩니다. 사용자 데이터를 git에 추가하지 마세요. 생성되는 `.antigravity/rules.md`는 로컬에만 두세요.
- API 토큰을 하드코딩하지 마세요. 보관이 필요하면 `conf` 기반 설정(`src/lib/config.ts`)을 사용하고 출력 시 토큰을 마스킹하세요.
