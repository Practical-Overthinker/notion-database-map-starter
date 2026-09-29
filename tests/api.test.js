import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
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
assert.equal(result.nodes[0].name, "Database A");
assert.equal(result.nodes[0].category, "Systems");
assert.equal(result.nodes[1].category, "Knowledge");
assert.deepEqual(result.edges[0], {
  source: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  target: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  label: "Related",
});
assert.equal(result.nodes[2].name, "HQ Chapters");
assert.equal(result.nodes[2].category, "Chapters");
assert.equal(result.nodes[2].status, "Active Live");

const areas = [
  "Systems",
  "Initiatives",
  "Content",
  "Equipment",
  "Requests & Bugs",
  "Mentored",
  "Experiments",
];
const customerRows = areas.map((area, index) => {
  const id = `${String(index + 1).padStart(8, "0")}-0000-0000-0000-000000000000`;
  return {
    id,
    url: `https://notion.so/${index + 1}`,
    properties: {
      Database: { title: rich(`${area} Registry`) },
      Name: { title: rich("Wrong fallback name") },
      Area: { select: { name: area } },
      Category: { select: { name: "Wrong fallback area" } },
      Status: { status: { name: "Active" } },
      DBID: { rich_text: rich("11111111-1111-1111-1111-111111111111") },
      Description: { rich_text: rich(`${area} records`) },
      Relations: {
        relation:
          index === 0
            ? [{ id: "00000002-0000-0000-0000-000000000000" }]
            : [],
      },
    },
  };
});
const customerMap = transformRows(customerRows);
assert.deepEqual(
  customerMap.nodes.map((node) => node.name),
  areas.map((area) => `${area} Registry`),
);
assert.deepEqual(customerMap.nodes.map((node) => node.category), areas);
assert.equal(customerMap.nodes[0].status, "Active");
assert.equal(customerMap.nodes[0].dbid, "11111111-1111-1111-1111-111111111111");
assert.equal(customerMap.nodes[0].description, "Systems records");
assert.deepEqual(customerMap.edges, [
  {
    source: "00000001000000000000000000000000",
    target: "00000002000000000000000000000000",
    label: "Related",
  },
]);

const page = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const script = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "the frontend script should be present");
const elements = new Map();
function element() {
  let html = "";
  return {
    dataset: {},
    style: {},
    children: [],
    clientWidth: 1500,
    clientHeight: 1200,
    get innerHTML() { return html; },
    set innerHTML(value) { html = value; this.children = []; },
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {},
    removeAttribute() {},
    addEventListener() {},
    appendChild(child) {
      this.children.push(child);
    },
    querySelectorAll() {
      return [];
    },
  };
}
const document = {
  documentElement: element(),
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  },
  createElementNS: element,
  querySelectorAll() {
    return [];
  },
};
const context = vm.createContext({
  document,
  window: { matchMedia: () => ({ matches: false }) },
  localStorage: { getItem: () => null, setItem() {} },
  fetch: () => new Promise(() => {}),
  console,
  Date,
  ...Object.fromEntries(
    [
      "connections", "snap", "cleanup", "fit", "search", "panelKicker",
      "panelTitle", "panelSummary", "incomingCount", "outgoingCount",
      "totalCount", "relationLists",
    ].map((id) => [id, document.getElementById(id)]),
  ),
});
vm.runInContext(script, context);
context.customerMap = customerMap;
vm.runInContext("applyLiveData(customerMap)", context);
assert.deepEqual(Array.from(vm.runInContext("order", context)), areas);
assert.deepEqual(Array.from(vm.runInContext("CATEGORIES", context)), areas);
assert.deepEqual(
  Array.from(vm.runInContext("nodes.map(node => node.n)", context)),
  areas.map((area) => `${area} Registry`),
);
assert.ok(elements.get("nodes").children[0].innerHTML.includes("Systems Registry"));
assert.ok(elements.get("nodes").children[6].innerHTML.includes("Experiments Registry"));
assert.equal(elements.get("edges").children.length, 1);
assert.ok(elements.get("zones").innerHTML.includes("EXPERIMENTS"));
const styleFor = (area) => vm.runInContext(`categoryStyle(${JSON.stringify(area)}).solid`, context);
assert.equal(styleFor("Experiments"), styleFor("Experiments"));
assert.notEqual(styleFor("Experiments"), styleFor("Uncategorized"));
assert.notEqual(styleFor("Experiments"), styleFor("New Area"));
assert.ok(
  elements.get("zones").innerHTML.includes(
    `stroke="${styleFor("Experiments")}" stroke-opacity="0.33"`,
  ),
  "section outline should use a valid area color with separate opacity",
);

const markedArea = 'R&D <img src=x onerror="alert(1)">';
const markedName = 'Ops <script>alert("x")</script> & "Quotes" and \'Notes\'';
const markedMap = transformRows([
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    properties: {
      Database: { title: rich(markedName) },
      Area: { select: { name: markedArea } },
      Status: { status: { name: "Active" } },
      Description: { rich_text: rich("Records & reports") },
      Relations: { relation: [] },
    },
  },
]);
context.markedMap = markedMap;
vm.runInContext("applyLiveData(markedMap)", context);
const zoneMarkup = elements.get("zones").innerHTML;
const cardMarkup = elements.get("nodes").children[0].innerHTML;
assert.ok(zoneMarkup.includes('data-cat="R&amp;D &lt;img src=x onerror=&quot;alert(1)&quot;&gt;"'));
assert.ok(zoneMarkup.includes('R&amp;D &lt;IMG SRC=X ONERROR=&quot;ALERT(1)&quot;&gt;'));
assert.ok(cardMarkup.includes('Ops &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &quot;Quotes&quot; and &#39;Notes&#39;'));
assert.ok(cardMarkup.includes('R&amp;D &lt;IMG SRC=X ONERROR=&quot;ALERT(1)&quot;&gt;'));
assert.ok(cardMarkup.includes('Records &amp; reports'));
assert.doesNotMatch(zoneMarkup + cardMarkup, /<(?:img|script)\b/i);
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
