# Open Labs / Decoded Brain Notion Database System Map

A Vercel map for the Open Labs / Decoded Brain `HQ Master DBs` registry. The server-side function reads the registry securely; no token is stored in the repository or public HTML.

## Repository structure

- `public/index.html` — interactive SVG map
- `api/map.js` — secure Notion registry reader
- `vercel.json` — Vercel route configuration
- `.env.example` — variable names only; never place real credentials here

## Registry properties

- `Database` — title
- `Area` — select
- `Status` — status
- `DBID` — text containing the underlying data-source ID
- `Relations` — self-relation to other registry rows
- `Description` — text

Areas: Attendance, Directory, Equipment, Requests & Bugs, Mentored, Content, Initiatives, Chapters, Public Facing Pages, Documents.

Statuses: Pending, In Progress, In Review, Deprecated, Archived, Active Live.

## One repository, multiple workspaces

Import this same GitHub repository into a separate Vercel project for each Notion workspace. Configure different environment variables in each project:

- `NOTION_TOKEN` — the integration token belonging to that workspace
- `NOTION_DATA_SOURCE_ID` — the 32-character ID of that workspace's registry data source

Each Vercel project receives a separate URL and securely reads only its configured workspace. A commit to this repository redeploys every Vercel project connected to it.

## Deployment

1. Import the repository into a new Vercel project.
2. Leave Framework Preset as **Other** and Root Directory as `./`.
3. Add both required environment variables for Production, Preview, and Development.
4. Deploy.
5. Open `/api/map` and confirm JSON is returned.
6. Open `/` and confirm the visual map loads.
7. Embed that deployment URL in the corresponding Notion workspace.

## Security

Never put a real token in GitHub, `.env.example`, `public/index.html`, screenshots, or chat. The browser calls `/api/map`; only the server-side function can read the token. If loading fails, the UI displays an error instead of showing another workspace's fallback data.
