# Notion Database System Map

A Vercel map for a Notion database registry. The server-side function reads the registry using credentials configured in your own Vercel project; no token is stored in this repository or public HTML.

## Repository structure

- `public/index.html` — interactive SVG map
- `api/map.js` — secure Notion registry reader
- `vercel.json` — Vercel route configuration
- `.env.example` — safe example configuration; never place real credentials here
- `docs/schema.md` — registry fields, permissions, and setup
- `docs/troubleshooting.md` — recovery steps for empty or incorrect maps
- `prompts/setup-agent.md` — paste-ready setup instructions for one general AI agent
- `prompts/notion-ai.md` — optional Notion AI checklist for the Notion phase

## Registry properties

Set up the six canonical properties `Database`, `Area`, `Status`, `DBID`, `Relations`, and `Description` using the [registry schema guide](docs/schema.md). The map also reads older `Name` and `Category` properties as fallbacks and optional `Notes`. Configure the integration and data-source ID for your own registry.

Database cards use the registry's `Database` title. Map sections follow the order in which area labels first appear in the returned rows, and colors are derived from those labels. New `Area` values appear automatically without editing the map. Relation lines connect registry rows through `Relations`; `DBID` supplies each card's Notion database link when valid.

## Deployment

### 1. Create your GitHub copy

Use **Use this template → Create a new repository** on the [public template](https://github.com/Practical-Overthinker/notion-database-map-starter). Make the customer-owned repository private when possible. Confirm the project files, including `package.json` and `vercel.json`, are at the repository root on `main`; do not put them inside a nested folder.

### 2. Import into your Vercel account

Choose the import path that matches your GitHub repository:

- To deploy directly from the public template, use [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPractical-Overthinker%2Fnotion-database-map-starter). This button imports the public template repository itself.
- If you created a private GitHub copy in step 1, open Vercel **New Project** (or **Add New → Project**), choose **Import Git Repository**, and select that private repository. Do not use the public-template button for this path.

In either path, create the Vercel project in the customer’s account, keep **Framework Preset** as **Other**, and set **Root Directory** to `./` (the repository root). The Git repository connected to the Vercel project is the repository Vercel uses for future code updates; for a customer-owned setup using a private copy, that must be the customer’s private repository.

In that Vercel project’s **Settings → Environment Variables**, add these two values from the customer’s Notion workspace:

- `NOTION_TOKEN` — the integration secret. Enter it only in Vercel’s environment settings; never commit it or put it in the browser, repository, or chat.
- `NOTION_DATA_SOURCE_ID` — the ID of the registry’s data source.

Enable both variables for each environment the customer deploys (Production, Preview, and/or Development). Save and deploy the project. Environment changes take effect on a new deployment.

### 3. Verify the live map before embedding

Confirm the Vercel build succeeds, then open the deployment’s root URL directly in a browser. The map should load and show the customer’s own database names and `Area` values. If it does not, check `/api/map` and the [troubleshooting guide](docs/troubleshooting.md).

Before embedding, inspect the root URL’s document response headers in the browser’s Network panel. It must not return `X-Frame-Options: DENY`, `X-Frame-Options: SAMEORIGIN`, or a Content-Security-Policy `frame-ancestors 'self'` restriction; those prevent Notion from displaying the map in an iframe.

### 4. Embed the verified URL

Only embed after the direct live URL and response-header check pass. In Notion, add an **Embed** block with the deployment’s HTTPS root URL, not `/api/map`. Give the embed a tall frame (about 900–1,000 px where the host allows it). The map has a minimum app height of 650 px and its canvas scrolls internally; use the map’s pan/zoom controls or scroll within it to reach content beyond the visible area. On a short embed, the Notion page and map canvas may both need scrolling.

Use the map’s **Refresh from Notion** control to load registry data changes; changing registry rows does not require a code update. For app or template code changes, update the repository connected to the Vercel project (the customer’s private GitHub copy in a customer-owned setup), then let Vercel build and deploy that code change.

For missing rows, wrong categories, permissions, or embedding problems, use the [troubleshooting guide](docs/troubleshooting.md).

## Optional Notion template

The [registry schema guide](docs/schema.md) is the manual setup path and works without Notion AI. For a faster start, [duplicate the blank Notion Database Map Registry Template](https://practicaloverthinker.notion.site/Notion-Database-Map-Registry-Template-3ea41183ac9c81229a71c63a09f8bbb4) into your own workspace. It contains no customer rows or credentials. If you already have a registry, inspect it and confirm a preview of required changes before editing it.

## Guided setup prompts

Start with the [universal setup-agent prompt](prompts/setup-agent.md) in a general AI agent for the full Notion → GitHub → Vercel setup. If you want Notion AI's help with the registry, use the [optional Notion AI prompt](prompts/notion-ai.md) for Phase 1, then return to the universal prompt for GitHub and Vercel. The universal prompt also works without Notion AI.

## Security

Never put a real token in GitHub, `.env.example`, `public/index.html`, screenshots, or chat. The browser calls `/api/map`; only the server-side function can read the token. If loading fails, the UI displays an error instead of showing fallback data.
