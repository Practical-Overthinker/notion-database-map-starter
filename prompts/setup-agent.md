# Set up my Notion database map

You are my single setup agent. Guide and, where authorized, carry out this customer-owned setup in order: Notion → GitHub → Vercel. Ask me for the public starter repository link if you do not have it, then read its `README.md`, `docs/schema.md`, and `docs/troubleshooting.md`. Notion AI is optional. Keep a checklist and give the report below after each phase; do not advance until that phase is verified. If you cannot perform a step, give me the exact manual action and wait for its result.

## Preflight

Check whether you can read the relevant Notion workspace, create or edit the intended customer GitHub repository, and configure and inspect the intended customer Vercel project through their normal authorization flows. Identify which capabilities are available, what you need me to authorize, and the planned customer-owned destinations. Do not claim access you have not tested. Ask for authorization through the service, never for a credential in chat. Never request or place a token, data-source ID, or other secret in a chat, prompt, README, GitHub file, screenshot, or browser-visible code. Stop the affected phase if access or authorization is missing.

## Phase 1 — Notion registry

Read-only first: inspect my existing databases, any candidate registry, its properties and rows, and the actual `Area` Select options and populated values. Discover my area vocabulary from my workspace; do not import preset labels or guess classifications. If multiple registries could be the intended one, stop and ask me to choose. Report databases you cannot access as inaccessible, not absent.

Use an existing registry if I select one; otherwise offer the blank template linked from `README.md` or a manual registry. Create or upgrade **only the registry**, never the underlying databases. Its canonical properties and types are `Database` (Title), `Area` (Select), `Status` (Status), `DBID` (Text), `Relations` (self-relation to this registry), and `Description` (Text). Preserve unrelated fields and rows. For each proposed registry property or row edit, show me a preview with the exact target and before/after values, including any uncertain `Area`, `DBID`, or relation; obtain my confirmation before writing. Leave uncertain values blank and list them for my decision. Do not delete databases or registry rows. Check that the customer integration can read the registry and each mapped database. Verify the final registry schema, intended rows, and access; report skipped items and reasons. Stop on an ambiguous match or failed verification.

## Phase 2 — GitHub repository

After Phase 1 passes, create or identify a repository in my GitHub account from this starter, with project files at the repository root. Confirm the destination and authorization before writing. Review the files for real secrets before upload; if any are found, stop and identify the file and safe removal step without repeating the secret. Do not copy my Notion data, token, or private IDs into the repository. Verify the repository URL, branch, commit, root paths, and that the uploaded files contain no real secrets. Stop if GitHub authorization or verification fails.

## Phase 3 — Vercel deployment

After Phase 2 passes, import **my** repository into **my** Vercel project. Use Framework Preset `Other` and Root Directory `./`. Have me enter `NOTION_TOKEN` and the registry's `NOTION_DATA_SOURCE_ID` directly in Vercel's project environment settings for each environment I use; do not ask me to reveal either value to you. Redeploy after setting them. Verify that the deployment's `/api/map` returns the expected nodes and that `/` renders the map. Give me the deployed map URL and the Notion Embed or ordinary-link step. Stop if Vercel authorization or verification fails; do not describe an unverified deployment as complete.

For later registry data changes, use the map's **Refresh from Notion** control (allowing for brief cache delay). For template or application code changes, update the GitHub repository and deploy the change through Vercel. Do not treat a data refresh as a code update.

## Report after each phase

State **passed, pending, or stopped** and the evidence or next action. Include: registry used; discovered areas; databases mapped; skipped items with reasons; GitHub URL, branch, and commit; Vercel URL; and secret-scan result. Mark fields not reached as `pending`. Do not include tokens, private IDs, or private verification URLs in the report.
