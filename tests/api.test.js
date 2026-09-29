import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transformRows } from "../api/map.js";

const rich = (text) => [{ plain_text: text }];
const rows = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    url: "https://notion.so/a",
    properties: {
      Name: { title: rich("Database A") },
      Status: { status: { name: "Active" } },
      Category: { select: { name: "Systems" } },
      DBID: { rich_text: rich("11111111-1111-1111-1111-111111111111") },
      Description: { rich_text: rich("Source") },
      Notes: { rich_text: [] },
      Relations: { relation: [{ id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" }] },
    },
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    url: "https://notion.so/b",
    properties: {
      Name: { title: rich("Database B") },
      Status: { status: { name: "Review" } },
      Category: { select: { name: "Knowledge" } },
      DBID: { rich_text: [] },
      Description: { rich_text: [] },
      Notes: { rich_text: rich("Fallback note") },
      Relations: { relation: [{ id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" }] },
    },
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    url: "https://notion.so/c",
    properties: {
      Database: { title: rich("HQ Chapters") },
      Status: { status: { name: "Active Live" } },
      Area: { select: { name: "Chapters" } },
      DBID: { rich_text: rich("2cee37a75f4180fa8d9a000b9746a000") },
      Description: { rich_text: rich("Chapter records") },
      Relations: { relation: [] },
    },
  },
];

const result = transformRows(rows);
assert.equal(result.nodes.length, 3);
assert.equal(
  result.edges.length,
  1,
  "reciprocal relations should be deduplicated",
);
assert.equal(
  result.nodes[0].url,
  "https://www.notion.so/11111111111111111111111111111111",
);
assert.equal(result.nodes[1].url, "https://notion.so/b");
assert.deepEqual(result.edges[0], {
  source: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  target: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  label: "Related",
});
assert.equal(result.nodes[2].name, "HQ Chapters");
assert.equal(result.nodes[2].category, "Chapters");
assert.equal(result.nodes[2].status, "Active Live");

const page = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
assert.match(
  page,
  /function resizeCanvas\(\)[\s\S]*?BASE_H = Math\.max\(1200, bottom \+ 16\)/,
  "the SVG canvas height should follow the rendered map bounds",
);
assert.match(
  page,
  /svg\.setAttribute\("viewBox", `0 0 \$\{BASE_W\} \$\{BASE_H\}`\)/,
  "the SVG viewBox should use the rendered canvas height",
);
assert.match(
  page,
  /id="theme"[\s\S]*?aria-pressed="false"/,
  "the toolbar should expose a theme toggle",
);
assert.match(
  page,
  /const THEME_KEY = "database-map-theme"[\s\S]*?localStorage\.setItem\(THEME_KEY, next \? "dark" : "light"\)/,
  "the selected theme should be persisted",
);
assert.match(
  page,
  /themeButton\.setAttribute\("aria-pressed", String\(nightMode\)\)/,
  "the theme toggle should expose its pressed state",
);
console.log("API transformation tests passed");
