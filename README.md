# Notion Database System Map

A Vercel map for a Notion database registry. The server-side function reads the registry using credentials configured in your own Vercel project; no token is stored in this repository or public HTML.

## Repository structure

- `public/index.html` — interactive SVG map
- `api/map.js` — secure Notion registry reader
- `vercel.json` — Vercel route configuration
- `.env.example` — safe example configuration; never place real credentials here

## Registry properties

The map reads registry pages with these properties: `Database` (or `Name`), `Area` (or `Category`), `Status`, `DBID`, `Relations`, `Description`, and optional `Notes`. Configure the integration and data-source ID for your own registry.

## Deployment

1. Create your own GitHub repository from this template.
2. Import that repository into your own Vercel project.
3. Leave Framework Preset as **Other** and Root Directory as `./`.
4. Set `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in the Vercel project environment for Production, Preview, and Development.
5. Deploy, then open `/api/map` to confirm JSON is returned and `/` to confirm the map loads.
6. Embed your deployment URL in the corresponding Notion workspace.

## Security

Never put a real token in GitHub, `.env.example`, `public/index.html`, screenshots, or chat. The browser calls `/api/map`; only the server-side function can read the token. If loading fails, the UI displays an error instead of showing fallback data.
