# Notion registry setup

The registry is a Notion database in your own workspace. Each row represents one database you want on the map. Create it manually, or copy the optional [Notion registry template](../README.md#optional-notion-template) when a verified copy link is available. Notion AI is not required.

## Required properties

Use these names and types exactly. The map reads all six properties; only `Database` needs a value in every row.

| Property | Notion type | What to enter | Can the value be blank? |
| --- | --- | --- | --- |
| `Database` | Title | The database name to show on the card. | No. |
| `Area` | Select | The customer's own grouping label. | Yes; the map shows `Uncategorized`. |
| `Status` | Status | The customer's own lifecycle label. | Yes; the map shows `Unknown`. |
| `DBID` | Text | The ID of the database represented by this row, copied from its Notion URL. | Yes; the card then links to the registry row. |
| `Relations` | Relation to this same registry | Other registry rows that this database relates to. | Yes; no relation line is drawn. |
| `Description` | Text | A short explanation of what the database contains. | Yes. |

`DBID` is the ID of the *mapped database*, not the registry's data-source ID. The two serve different purposes. A valid `DBID` makes the card link to that database; otherwise the card links to its registry row. `Relations` links registry rows, not the underlying databases. Add this self-relation after creating the registry, when Notion can target the new registry as a relation source.

The map also understands older `Name` and `Category` properties as fallbacks, plus optional `Notes`. New registries should use the six names above. You do not need to rename or delete working legacy properties just to start.

## New registry: manual path

1. Create a database in your Notion workspace. Name it as you like, and set its title property to `Database`.
2. Add `Area` (Select), `Status` (Status), `DBID` (Text), and `Description` (Text). Add `Relations` as a relation to this registry itself.
3. Add one row per database you want mapped. Enter its name. Copy its actual database ID into `DBID` if you want the card to open that database. Enter only known `Area` and `Relations` values; blanks are safe while you check them.
4. Create a Notion integration owned by your organization. Share the registry **and every database you want mapped** with that integration. Sharing the registry alone cannot grant access to the other databases. If a database is inaccessible, report it as inaccessible; do not guess its name, ID, area, or relations.
5. Use the registry's **data-source ID** for `NOTION_DATA_SOURCE_ID` in Vercel. Set the integration token as `NOTION_TOKEN` in Vercel's project environment. Do not put either value in this repository, a page, or a chat.
6. Deploy and check `/api/map` for the expected rows, then check `/` for the rendered map.

If you have no Notion AI, the steps above are the full setup. The optional template is a convenience, not a dependency.

## Existing registry: minimal upgrade

Inspect the existing registry's properties, rows, and permissions first. Compare them with the six fields above and preview the exact additions or changes needed. Ask the customer to confirm that preview before making registry changes. Add or correct only the required properties or values; preserve unrelated fields and rows.

Keep existing `Area` values. Discover the customer's area vocabulary from the registry, including its Select options and populated rows. Do not import a preset list or silently reclassify rows. Ask the customer before assigning an uncertain area. Blank `Area` values are better than guessed categories.

After the confirmed changes, check that the integration can read the registry and every mapped database. Report inaccessible databases for the customer to share or remove from scope.
