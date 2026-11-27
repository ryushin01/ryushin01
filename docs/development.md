# 개발 가이드

GitHub 프로필 첫 화면에 보이는 README 저장소입니다. 빌드할 코드가 없고, 버전도 매기지 않습니다(그래서 `CHANGELOG.md`와 릴리스가 없습니다).

## 파일

| 파일 | 내용 |
|---|---|
| `README.md` | 프로필 본문: 소개, 기술 스택(그림 + 표), 관심사, 프로젝트 표, 출처 |
| `docs/images/tech-stack.svg` | 기술 스택 아이콘을 한 장으로 모은 그림 |
| `docs/images/projects/<저장소>.png` | 프로젝트 표 이름 앞의 아이콘(64×64 PNG, 화면에는 20×20) |
| `docs/third-party-notices.md` | 아이콘 자료의 라이선스 전문(MIT·Apache 2.0) |
| `scripts/tech-stack.test.mjs` | 기술 스택 그림·README 표·출처의 개수와 순서를 맞춰 보는 검사(`node --test scripts/`) |
| `scripts/versions.mjs` | 프로젝트 표의 버전 `(v1.2.3)`을 각 저장소에서 읽어 고치는 스크립트 |
| `.github/workflows/versions.yml` | 위 스크립트를 30분마다, README가 바뀔 때, 손으로 실행할 때 돌림 |

## 프로젝트 표 고치기

- 한 줄 모양: `| 번호 | <img …> [이름](https://github.com/ryushin01/저장소) | 내용 | 기술 | 확인 |`
- **새 프로젝트**: 번호 순서에 맞춰 줄을 넣고 이름만 적습니다. 버전은 merge 뒤 워크플로가 붙입니다. 아이콘은 `docs/images/projects/<저장소>.png`(64×64)로 넣고 `alt=""`로 둡니다(이름이 바로 옆에 있으므로 장식).
- **버전은 손으로 고치지 않습니다.** 저장소 기본 브랜치의 `package.json` `version` → 최신 릴리스 → 가장 높은 정식 태그 순서로 읽습니다. 버전을 고정할 저장소는 `scripts/versions.mjs`의 `FIXED`에 둡니다(지금은 ZERO 1.2.3).
- **확인 칸**: 운영·데모·어드민·Storybook 주소를 적습니다. 운영은 `https://<프로젝트>-ryushin01.vercel.app`, 정적 웹 빌드는 `https://ryushin01.github.io/<저장소>/`입니다. 링크를 바꾸면 200으로 열리는지 확인합니다.
- 머리글 "프로젝트" 앞뒤의 `&nbsp;`와 글자 사이 `&#8288;`는 이름 칸 폭을 지키려는 것이라 지우지 않습니다(README 안 주석 참고).

## 기술 스택 고치기

1. 표(`## 기술 스택` 아래)에 기술 이름을 더합니다.
2. 그림에도 아이콘을 넣으려면 `docs/images/tech-stack.svg`에 아이콘을 더하고, 맨 위 `aria-label`과 README의 그림 대체 텍스트에 이름을 같은 순서로 넣습니다.
3. 아이콘을 새 자료에서 가져왔으면 README의 `## 출처` 표와 `docs/third-party-notices.md`를 함께 고칩니다. 쓴 아이콘 수(예: Skill Icons "아이콘 38개와 나머지 62개의 바탕")가 두 문서에서 같아야 합니다.

## 버전 스크립트를 로컬에서 돌리기

```bash
GITHUB_TOKEN=$(gh auth token --user ryushin01) node scripts/versions.mjs
git diff README.md
```

Node 22 이상이 필요합니다. 비공개 저장소의 버전을 읽으려면 토큰이 있어야 하고, 읽지 못한 줄은 고치지 않고 경고만 남깁니다.

## 작업 흐름

- `main`에 직접 커밋하지 않고 브랜치(`docs/…`, `chore/…`)에서 고친 뒤 PR로 merge합니다.
- 커밋 메시지는 Conventional Commits(`docs: …`)에 한국어 요약입니다.
- merge한 뒤 GitHub 프로필 화면에서 표·그림이 깨지지 않았는지 확인합니다.
