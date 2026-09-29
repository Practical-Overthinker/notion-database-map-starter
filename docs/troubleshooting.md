# Troubleshooting the database map

Start with your deployed `/api/map` response. It separates registry or configuration problems from rendering problems: `nodes` contains cards and `edges` contains relation lines. The map's Refresh from Notion control requests current data; the server can cache a response briefly, so allow a few minutes after a registry change.

| Symptom | Check and fix |
| --- | --- |
| Missing or `Untitled database` names | Fill the row's `Database` title. Existing registries may use `Name`, but a populated `Database` takes priority. Confirm the row is in the registry data source being queried. |
| Missing rows or an empty map | Confirm the rows exist in the selected registry data source and that the customer integration can access the registry **and each database being mapped**. Report inaccessible databases; do not invent missing entries. Check `/api/map` for `nodes` before troubleshooting the visual map. |
| Wrong data-source ID | `NOTION_DATA_SOURCE_ID` must identify the registry's data source, not its database page, a mapped database's `DBID`, or a saved view. Recheck the registry's data-source ID and update the Vercel environment value. The server requires a 32-character hexadecimal ID, with or without hyphens. |
| Permission error from Notion | Share the registry and each intended mapped database with the customer's integration. Confirm the integration belongs to the correct workspace and has read access. Do not request or paste its token in chat. A missing permission is not evidence that a database does not exist. |
| Wrong categories or `Uncategorized` | The map uses `Area` Select values from the registry; older `Category` values are a fallback. Preserve the customer's existing area vocabulary. Fill blank areas only after the customer confirms uncertain classifications. New area labels appear automatically. |
| Stale cards after editing Notion | Use Refresh from Notion or reload `/api/map`; allow a few minutes for the server cache to clear. Confirm the edit was made in the registry data source used by this deployment. A new deployment is needed only after changing Vercel environment settings or code. |
| Notion iframe is blank or blocked | Open the deployed map URL in a normal browser tab first. Use the deployment's HTTPS URL in Notion's Embed block. If Notion or browser embedding restrictions block it, keep a normal link to the map instead. Do not embed the `/api/map` JSON endpoint. |
| Works in one Vercel environment but not another | Set `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in the same Vercel project for each environment you use: Production, Preview, and Development. Changes to environment settings apply to new deployments, so redeploy the affected environment and recheck `/api/map`. |

If `/api/map` returns a configuration error, review the two Vercel settings and the data-source ID format. If it returns a Notion error, check the registry ID and integration access. If it returns valid JSON with the expected `nodes` but `/` is wrong, reload the map and check browser errors. Share error text only after removing tokens, private IDs, and workspace details.
