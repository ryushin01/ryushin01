# AGENTS.md — ryushin01 (GitHub 프로필 저장소)

AI 코딩 에이전트(Codex, Claude Code 등)가 이 저장소에서 일할 때 지킬 규칙입니다. 코드 프로젝트가 아니라 README·SVG·스크립트로 된 GitHub 프로필 저장소입니다.

## 1. 프로젝트 개요

- https://github.com/ryushin01 첫 화면에 보이는 프로필 README입니다. 소개, 기술 스택(그림과 표), 관심사, 공개 프로젝트 표, 출처로 되어 있습니다.
- 화면 축 없음(프로필 저장소는 화면 축 정리에서 뺌). 배포 대상 없음, GitHub가 README를 바로 보여 줍니다.

## 2. 구성

```
README.md                    프로필 본문
docs/images/tech-stack.svg   기술 스택 그림
docs/images/projects/*.png   프로젝트 표 아이콘(저장소 이름과 같은 파일 이름)
docs/third-party-notices.md  서드파티 고지(MIT·Apache 2.0 등 전문)
scripts/versions.mjs         프로젝트 표의 버전 자동 갱신
.github/workflows/versions.yml
```

- `package.json`·패키지 매니저·린트·테스트 도구는 없습니다.

## 3. 명령

- 버전 갱신을 로컬에서 돌려 보기(토큰은 값을 적지 말고 환경 변수로만): `GITHUB_TOKEN=… node scripts/versions.mjs`. Node 22(워크플로 기준)에서 돕니다.
- Actions에서 손으로: `gh workflow run versions.yml`.

## 4. 검사

- CI 검사 워크플로는 없습니다. PR 전에 다음을 직접 확인합니다.
  - README 표가 깨지지 않는지(줄마다 `| 번호 | 프로젝트 | 내용 | 기술 | 실행 |` 5칸 유지, 브랜치의 README를 GitHub에서 열어 확인).
  - 기술 스택 그림을 고쳤으면 아래 5절의 세 곳(그림 순서, 대체 텍스트, 출처 표)이 서로 맞는지.
  - 링크(데모·저장소·출처)가 200인지.
- `versions.yml`: 30분마다, `README.md`가 main에 푸시될 때, 손으로 실행할 때 돌아 바뀐 버전만 `docs: 프로젝트 버전 갱신`으로 main에 커밋합니다(작성자는 ryushin01로 설정).

## 5. 내용 규칙

### 프로젝트 표

- 칸: **번호 · 프로젝트(아이콘 + 이름 링크 + 버전) · 내용 · 기술 · 실행**. 줄은 저장소 이름의 대소문자 무시 가나다(알파벳)순이고 번호는 1부터 차례로 다시 매깁니다.
- 이름 칸: `<img src="docs/images/projects/<저장소>.png" width="20" height="20" alt="" align="absmiddle">&nbsp;[이름](https://github.com/ryushin01/<저장소>) (vX.Y.Z)`. 아이콘은 장식이라 `alt=""`입니다. 머리글 "프로젝트" 앞뒤의 `&nbsp;`와 `&#8288;`는 이름 칸 최소 폭용이므로 지우지 않습니다.
- 버전 `(vX.Y.Z)`는 손으로 고치지 않습니다. `scripts/versions.mjs`가 각 저장소 기본 브랜치의 `package.json` `version` → 최신 릴리스 → 가장 높은 정식 태그 순으로 읽어 고칩니다. 새 줄은 이름만 적어도 됩니다. 버전이 없는 저장소(이 프로필 저장소)는 이름만 둡니다.
- **ZERO는 v1.2.3으로 고정**입니다. `versions.mjs`의 `FIXED = { ZERO: "1.2.3" }`가 저장소를 읽지 않고 이 값을 씁니다(2026-11-15 사용자 요청). 지우거나 바꾸지 않습니다.
- 내용 칸은 `한 줄 소개: 주요 기능, …` 형식, 기술 칸은 주요 기술을 쉼표로, 실행 칸은 데모·운영 링크(`[보기](…)`)입니다. 각 저장소의 소개가 크게 바뀌거나 데모 링크가 생기면 내용·기술·실행 칸을 고칩니다.
- 지운 저장소의 줄과 아이콘은 함께 뺍니다.

### 기술 스택 그림(`docs/images/tech-stack.svg`)

- 아이콘을 아래 기술 표의 분류 순서(언어 → 프레임워크 → 라우팅·다국어 → 상태·데이터 → 스타일 → UI·인터랙션 → 테스트 → 문서·품질 → 빌드·도구 → 협업·AI)대로 놓습니다.
- 아이콘을 더하거나 빼면 세 곳을 함께 맞춥니다.
  1. README 그림의 대체 텍스트(`![…](docs/images/tech-stack.svg)`, 아이콘 이름을 그림 순서대로 쉼표로).
  2. SVG 최상위의 `role="img"`·`aria-label`과 `<title>`(같은 목록), 아이콘마다 감싼 `<g>`의 `<title>`.
  3. README `## 출처`의 아이콘 출처 표(자료별 개수와 아이콘 이름, 예: Skill Icons "아이콘 N개와 나머지 M개의 바탕")와 `docs/third-party-notices.md`의 "쓴 곳".
- 아래 기술 표(구분·기술)는 그림보다 자세해도 됩니다. 분류 순서는 그림과 같게 둡니다.

### 아이콘 출처·서드파티 고지

- 바깥 자료로 만든 아이콘은 README `## 출처`의 표(자료 · 저작자·라이선스 · 쓴 곳)에 적고, 직접 그린 프로젝트 아이콘은 표 위 문단의 "직접 그렸습니다" 목록에 넣습니다.
- MIT·Apache 2.0처럼 저작권 표시와 허가 문구를 함께 실어야 하는 라이선스는 `docs/third-party-notices.md`에 전문을 그대로 옮깁니다. CC BY·Flaticon처럼 출처 표기 조건이 있는 자료는 저작자와 라이선스 링크를 표에 적습니다. 로고의 상표권은 각 소유자에게 있다는 문장을 유지합니다.
- 저작권이 불분명한 이미지는 쓰지 않습니다.
- 보관함 참고 문서: `~/Documents/Obsidian Vault/ryushin01 기술 스택 아이콘.md`.

## 6. Git·PR

- **흐름: GitHub Flow.** `main`에 직접 커밋·푸시하지 않습니다(예외: `versions.yml` 워크플로(작성자 ryushin01)의 `docs: 프로젝트 버전 갱신`). 최신 `main`에서 브랜치를 만들어 PR로만 병합합니다. 표준과 다른 점: 최근 사람 커밋 일부(예: `docs: 출처 표에서 Ark 로고 줄 빼기`)가 PR 없이 main에 올라갔습니다. 앞으로는 PR로 올립니다.
- **브랜치 이름:** `docs/…`가 대부분입니다(예: `docs/terranova-1.5.0`, `docs/avocado-logo`). 스크립트·워크플로는 `chore/…`, 그 밖에 `feat/…`, `fix/…`, `refactor/…`, `test/…`, `release/…`.
- **커밋 메시지: Conventional Commits.** `<타입>: <한국어 요약>`. 실제 예: `docs: TerraNova 1.5.0 소개 갱신 (#157)`, `docs: ryushin01 아이콘을 흰 바탕 ZERO 로고로 교체 (#159)`. 다른 저장소의 버전을 소개할 때는 요약 안에 그 버전을 씁니다.
- **기여자는 ryushin01만 남깁니다(2026-11-21 사용자 결정).** 커밋 작성자는 늘 `ryushin0 <141554987+ryushin01@users.noreply.github.com>`입니다. 이 저장소는 백엔드 코드가 없으므로 `Co-Authored-By` 줄을 넣지 않습니다(백엔드 저장소만 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`). PR 본문 끝에는 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`를 적습니다.
  - GitHub Actions가 커밋하는 워크플로는 작성자를 ryushin01로 설정합니다(`github-actions[bot]` 금지): `versions.yml`의 `git config user.name/user.email`.
  - Dependabot PR은 그대로 병합하지 않고, 같은 변경을 ryushin01 커밋으로 다시 만들어 PR로 병합합니다.
- **버전·변경 기록:** 이 저장소는 버전·`CHANGELOG.md`·릴리스가 없습니다(Semantic Versioning·Keep a Changelog 대상 아님).
- 병합은 squash(제목 끝 `(#번호)`). 검사 CI가 없으므로 5절을 확인한 뒤 병합합니다. CodeRabbit 리뷰는 기다리지 않습니다.
- 공유 파일이라 여러 세션·에이전트가 같이 고칩니다. 저장소별 작업이 끝난 뒤 한 곳에서 모아 고치고, 열린 PR과 겹치는 줄은 피합니다. README 푸시마다 버전 워크플로가 돌므로 고칠 것을 모아 한 번에 올립니다.

## 7. 배포·릴리스

- 배포·릴리스는 없습니다. main에 병합되면 프로필 화면에 바로 보입니다.
- 사용자가 배포를 특정 날짜에 일괄로 하기로 하면 프로필 표 변경도 그날 함께 병합합니다.
- 백업 `bash ~/Documents/Archive/Backup/backup.sh`는 다른 저장소 릴리스 뒤에 돌리며, 이 저장소는 릴리스 태그가 없습니다.

## 8. 보안·주의사항

- 비밀값·토큰을 커밋하지 않습니다. 워크플로는 `secrets.GITHUB_TOKEN`만 씁니다.
- `versions.mjs`는 저장소를 읽지 못하면 그 줄을 고치지 않고 경고만 남깁니다(이전 버전을 지우지 않음). 이 동작을 유지합니다.
- 개인 연락처·링크(포트폴리오, 리멤버)는 사용자가 바꾸라고 할 때만 고칩니다.
- 워크플로 실행·병합 상태는 명령 결과(`gh run list -w versions.yml`, `gh pr view`)로 확인한 것만 말합니다.
- 먼저 묻기: `versions.mjs`·`versions.yml`의 동작(읽는 순서, `FIXED`, 실행 주기) 변경, 기술 스택 그림의 배치·모양 변경.
- 절대 금지: 토큰 값을 README·스크립트·워크플로에 적기, `--no-verify`로 훅 우회, 사람 작업을 `main`에 직접 푸시.

## 9. 공통 규칙

공통 규칙은 `~/Documents/GitHub/CLAUDE.md`에 있습니다(이 파일과 충돌하면 이 파일이 우선). 핵심:

- 답변·커밋·PR·문서는 한국어로 씁니다.
- 묻지 않고 끝까지 진행하고 결과를 한 번에 보고합니다. 비용이 드는 일, 새 비밀값, 디자인 결정, 되돌릴 수 없는 공개 행동은 하지 않고 보고합니다.
- 사용자의 진행 중인 작업(커밋하지 않은 변경, 원격에 없는 브랜치)을 건드리지 말고 `git worktree add /tmp/<이름> -b <브랜치> origin/main`에서 작업한 뒤 worktree를 지웁니다.
- 다른 세션에 공지할 때는 Paseo ryushin01 그룹 세션에만 보냅니다.
