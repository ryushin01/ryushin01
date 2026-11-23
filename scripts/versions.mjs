/**
 * 프로젝트 표의 이름 뒤에 각 저장소의 현재 버전을 "Ark (v0.1.2)" 모양으로 붙입니다.
 *
 *   GITHUB_TOKEN=... node scripts/versions.mjs
 *
 * 버전은 저장소 기본 브랜치의 package.json `version` → 최신 릴리스 → 가장 높은 정식 버전 태그 순서로 읽습니다.
 * 버전을 고정한 저장소(FIXED)는 읽지 않고 그 버전을 씁니다. 버전이 없는 저장소(이 프로필 저장소 등)는 이름만 둡니다.
 * 저장소를 읽지 못하면 그 줄은 고치지 않고 경고만 남깁니다(이전 버전을 지우지 않음).
 * GitHub Actions(.github/workflows/versions.yml)가 30분마다, 그리고 README가 바뀔 때 돌립니다.
 */
import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "ryushin01";
/** 버전을 고정한 저장소. ZERO는 기능이 바뀌어도 v1.2.3 그대로입니다(2026-11-15 사용자 요청). */
const FIXED = { ZERO: "1.2.3" };
const README = new URL("../README.md", import.meta.url);
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ryushin01-profile-versions",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

/** @param {string} path */
async function gh(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?$/;
/** 시험판(-rc 등)이 아닌 정식 버전 태그 */
const STABLE = /^v?(\d+)\.(\d+)\.(\d+)$/;
const plain = (/** @type {string} */ v) => v.replace(/^v/, "");
const compare = (/** @type {string} */ a, /** @type {string} */ b) => {
  const [x, y] = [a, b].map((v) => /** @type {RegExpMatchArray} */ (v.match(STABLE)).slice(1, 4).map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

/** 태그를 모든 쪽에서 읽습니다. @param {string} repo */
async function allTags(repo) {
  /** @type {string[]} */
  const names = [];
  for (let page = 1; ; page += 1) {
    const tags = /** @type {{ name: string }[] | null} */ (await gh(`repos/${OWNER}/${repo}/tags?per_page=100&page=${page}`));
    if (!tags?.length) break;
    names.push(...tags.map((t) => t.name));
    if (tags.length < 100) break;
  }
  return names;
}

/** 저장소의 현재 버전. 없으면 null @param {string} repo */
async function versionOf(repo) {
  if (FIXED[repo]) return FIXED[repo];
  // 저장소 자체를 못 읽으면(이름이 바뀌었거나 비공개가 됨) 그 줄을 지우지 않도록 오류로 넘깁니다.
  const meta = await gh(`repos/${OWNER}/${repo}`);
  if (!meta) throw new Error(`저장소를 찾지 못했습니다: ${OWNER}/${repo}`);
  const pkg = await gh(`repos/${OWNER}/${repo}/contents/package.json?ref=${encodeURIComponent(meta.default_branch)}`);
  if (pkg?.content) {
    let version;
    try {
      version = JSON.parse(Buffer.from(pkg.content, "base64").toString("utf8")).version;
    } catch {
      version = undefined;
    }
    if (typeof version === "string" && SEMVER.test(version) && plain(version) !== "0.0.0") return plain(version);
  }
  const release = await gh(`repos/${OWNER}/${repo}/releases/latest`);
  if (release?.tag_name && SEMVER.test(release.tag_name)) return plain(release.tag_name);
  const best = (await allTags(repo))
    .filter((name) => STABLE.test(name))
    .sort(compare)
    .at(-1);
  return best ? plain(best) : null;
}

// 표의 줄: | 번호 | [이름](https://github.com/ryushin01/저장소) (v1.2.3) | 내용 | 기술 | 확인 |
// 이름 앞에 아이콘(<img>)이 있어도 됩니다.
const ROW = /^\| \d+ \| /;
const LINK = new RegExp(`(\\[[^\\]]+\\]\\(https://github\\.com/${OWNER}/([^)/\\s]+)\\))(?: \\(v[^)\\s]+\\))?`);

const lines = readFileSync(README, "utf8").split("\n");
let changed = 0;
let failed = 0;
for (const [i, line] of lines.entries()) {
  if (!ROW.test(line)) continue;
  const cells = line.split(" | ");
  const match = cells[1]?.match(LINK);
  if (!match) continue;
  const repo = match[2];
  let version;
  try {
    version = await versionOf(repo);
  } catch (error) {
    failed += 1;
    console.log(`::warning::${repo}의 버전을 읽지 못해 그대로 둡니다 (${/** @type {Error} */ (error).message})`);
    continue;
  }
  const cell = cells[1].replace(LINK, version ? `$1 (v${version})` : "$1");
  if (cell !== cells[1]) {
    cells[1] = cell;
    lines[i] = cells.join(" | ");
    changed += 1;
    console.log(`${repo}: ${version ? `v${version}` : "버전 없음"}`);
  }
}
writeFileSync(README, lines.join("\n"));
console.log(`버전을 고친 줄 ${changed}개${failed ? `, 읽지 못한 저장소 ${failed}개` : ""}`);
