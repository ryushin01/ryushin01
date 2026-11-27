// 기술 스택 그림·README·출처가 서로 맞는지 검사합니다. 실행: node --test scripts/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const EXPECTED = 100;
const root = new URL("../", import.meta.url);
const readme = readFileSync(new URL("README.md", root), "utf8");
const svg = readFileSync(new URL("docs/images/tech-stack.svg", root), "utf8");
const notices = readFileSync(new URL("docs/third-party-notices.md", root), "utf8");

// 괄호 안의 쉼표는 나누지 않는 쉼표 분리
const splitList = (s) => s.split(/, (?![^()]*\))/).map((x) => x.trim()).filter(Boolean);

const altText = /!\[([^\]]*)\]\(docs\/images\/tech-stack\.svg\)/.exec(readme)[1];
const altList = splitList(altText);
const ariaLabel = /^<svg[^>]*\saria-label="([^"]*)"/.exec(svg)[1];
const rootTitle = /^<svg[^>]*>\s*<title>([^<]*)<\/title>/.exec(svg)[1];
const groups = [...svg.matchAll(/<g transform="translate\((\d+) (\d+)\)"><title>([^<]*)<\/title>/g)];
const groupTitles = groups.map((m) => m[3]);

test("그림 안의 아이콘 <g> 개수", () => {
  assert.equal(groups.length, EXPECTED);
});

test("대체 텍스트 = aria-label = 최상위 title = 아이콘 title, 그림 순서대로", () => {
  assert.equal(altList.length, EXPECTED);
  assert.equal(new Set(altList).size, EXPECTED, "이름이 겹침");
  assert.deepEqual(splitList(ariaLabel), altList);
  assert.deepEqual(splitList(rootTitle), altList);
  assert.deepEqual(groupTitles, altList);
});

test("아이콘 자리(10열 격자)가 순서대로 놓임", () => {
  groups.forEach((m, i) => {
    assert.equal(Number(m[1]), (i % 10) * 300, `${m[3]} x`);
    assert.equal(Number(m[2]), Math.floor(i / 10) * 300, `${m[3]} y`);
  });
});

test("SVG에 스크립트·외부 폰트·외부 이미지가 없음", () => {
  assert.doesNotMatch(svg, /<script|<foreignObject|@import|@font-face|<style/i);
  assert.doesNotMatch(svg, /(?:href|src)="(?!#|data:image\/)[^"]*"/);
  assert.match(svg, /role="img"/);
});

// 기술 표(구분·기술)
const tableSection = readme.split("## 기술 스택")[1].split("## 관심사")[0];
const rows = tableSection
  .split("\n")
  .filter((l) => /^\| (?!구분|---)/.test(l))
  .map((l) => l.split(" | ").map((c) => c.replace(/^\| |\ \|$/g, "").trim()));
const CATEGORIES = ["언어", "프레임워크", "라우팅·다국어", "상태·데이터", "스타일", "UI·인터랙션", "테스트", "문서·품질", "빌드·도구", "협업·AI"];
const tableItems = rows.flatMap(([, items]) => splitList(items));
// 그림 이름과 표 이름이 다른 것
const ALIAS = {
  "Radix UI": "Radix Themes",
  Sass: "Sass(SCSS)",
  PWA: "Service Worker(PWA, Web Push)",
  Cloudflare: "Cloudflare Workers",
  Claude: "Claude Code",
  "Socket.IO": "Socket.IO Client",
};

test("기술 표의 분류 순서", () => {
  assert.deepEqual(rows.map((r) => r[0]), CATEGORIES);
});

test("기술 표의 순서와 그림 순서가 일치", () => {
  let last = -1;
  for (const name of altList) {
    const idx = tableItems.indexOf(ALIAS[name] ?? name);
    assert.notEqual(idx, -1, `기술 표에 ${name} 없음`);
    assert.ok(idx > last, `${name}의 순서가 그림과 다름`);
    last = idx;
  }
});

test("그림에서 뺀 기술이 기술 표에 남아 있지 않음", () => {
  for (const name of ["TanStack Query", "PostgreSQL", "Neon(PostgreSQL)", "Docker"]) {
    assert.ok(!tableItems.includes(name), `${name}이 기술 표에 있음`);
  }
});

// 출처 표
const sourceSection = readme.split("## 출처")[1];
const firstTable = sourceSection.split("프로젝트 표의 아이콘")[0];
const sourceRows = firstTable.split("\n").filter((l) => /^\| (?!자료|---)/.test(l)).map((l) => l.split(" | "));
const used = (cell) => cell.replace(/ \|$/, "");
const skill = sourceRows.find((c) => c[0].includes("Skill Icons"));
const [, skillCount, restCount] = /아이콘 (\d+)개와 나머지 (\d+)개의 바탕/.exec(used(skill[2]));
const listed = sourceRows
  .filter((c) => c !== skill)
  .flatMap((c) =>
    used(c[2])
      .replace(/ 로고$/, "")
      .split(/, (?![^()]*\))|·/)
      .map((x) => x.replace(/\(.*\)/, "").replace(/ 로고$/, "").trim()),
  );
const DRAWN = ["Jotai"];

test("출처 표의 개수 합계", () => {
  assert.equal(Number(skillCount) + Number(restCount), EXPECTED);
  assert.equal(listed.length + DRAWN.length, Number(restCount));
  assert.match(readme, /Jotai 아이콘은 .*직접 그렸습니다/);
});

test("출처 표에 적힌 이름은 모두 그림에 있고 겹치지 않음", () => {
  for (const name of [...listed, ...DRAWN]) assert.ok(altList.includes(name), `${name}이 그림에 없음`);
  assert.equal(new Set([...listed, ...DRAWN]).size, listed.length + DRAWN.length, "출처 이름이 겹침");
});

test("서드파티 고지의 개수가 README 출처와 같음", () => {
  assert.ok(notices.includes(`아이콘 ${skillCount}개와 나머지 ${restCount}개의 바탕`));
  const simple = sourceRows.find((c) => c[0].includes("Simple Icons"));
  const simpleCount = used(simple[2]).replace(/ 로고$/, "").split(/, (?![^()]*\))/).length;
  assert.ok(notices.includes(`로고 ${simpleCount}개`));
});
