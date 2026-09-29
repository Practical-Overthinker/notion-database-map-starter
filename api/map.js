const NOTION_VERSION = "2025-09-03";

function plainText(property) {
  const items = property?.title || property?.rich_text || [];
  return items
    .map((item) => item?.plain_text || item?.text?.content || "")
    .join("")
    .trim();
}

function normalizeId(value = "") {
  return String(value).replace(/-/g, "").toLowerCase();
}

function notionDatabaseUrl(dbid, fallbackUrl) {
  const normalized = normalizeId(dbid);
  return /^[0-9a-f]{32}$/.test(normalized)
    ? `https://www.notion.so/${normalized}`
    : fallbackUrl || "";
}

export function transformRows(rows) {
  const nodes = rows.map((page) => {
    const properties = page.properties || {};
    const dbid = plainText(properties.DBID);
    return {
      id: normalizeId(page.id),
      name:
        plainText(properties.Database) ||
        plainText(properties.Name) ||
        "Untitled database",
      category:
        properties.Area?.select?.name ||
        properties.Category?.select?.name ||
        "Uncategorized",
      status: properties.Status?.status?.name || "Unknown",
      description: plainText(properties.Description),
      notes: plainText(properties.Notes),
      dbid,
      url: notionDatabaseUrl(dbid, page.url),
      registryUrl: page.url || "",
      relationIds: (properties.Relations?.relation || []).map((item) =>
        normalizeId(item.id),
      ),
    };
  });

  const knownIds = new Set(nodes.map((node) => node.id));
  const seen = new Set();
  const edges = [];

  for (const node of nodes) {
    for (const targetId of node.relationIds) {
      if (!knownIds.has(targetId)) continue;
      const key =
        node.id === targetId
          ? `${node.id}:${targetId}`
          : [node.id, targetId].sort().join(":");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: node.id, target: targetId, label: "Related" });
    }
  }

  return {
    nodes: nodes.map(({ relationIds, ...node }) => node),
    edges,
    generatedAt: new Date().toISOString(),
  };
}

async function queryRegistry(token, dataSourceId) {
  const rows = [];
  let startCursor;

  do {
    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Notion-Version": NOTION_VERSION,
        },
        body: JSON.stringify({
          page_size: 100,
          ...(startCursor ? { start_cursor: startCursor } : {}),
        }),
      },
    );

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.message || `Notion returned ${response.status}`);
    }

    rows.push(...(payload.results || []));
    startCursor = payload.has_more ? payload.next_cursor : undefined;
  } while (startCursor);

  return rows;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.NOTION_TOKEN;
  const dataSourceId = normalizeId(process.env.NOTION_DATA_SOURCE_ID);

  if (!token || !/^[0-9a-f]{32}$/.test(dataSourceId)) {
    return response.status(500).json({
      error: "Server configuration is incomplete.",
      hint: "Set NOTION_TOKEN and NOTION_DATA_SOURCE_ID in Vercel.",
    });
  }

  try {
    const rows = await queryRegistry(token, dataSourceId);
    response.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300",
    );
    return response.status(200).json(transformRows(rows));
  } catch (error) {
    console.error("Map sync failed:", error);
    return response.status(502).json({
      error: "Unable to read the Notion registry.",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
