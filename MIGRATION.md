# URL Migration Map: SvelteKit → Next.js

## Preserved Routes (no redirect needed)
| Old URL | New URL | Notes |
|---------|---------|-------|
| /       | /       | Home page |
| /rules  | /rules  | Rules page |
| /trades | /trades | Trades page |
| /about  | /about  | About page |

## Changed Routes (redirects needed)
| Old URL | New URL | Status |
|---------|---------|--------|
| /matchups | /season/matchups | 301 |
| /transactions | /trades | 301 |
| /records | /analytics/all-time-records | 301 |
| /standings | /history/standings | 301 |
| /owners/:id | /owners/:id | Same pattern |
| /analytics | /analytics | Same |
| /drafts | /drafts | Same |
| /seasons | /seasons | Same |
| /history | /history | Same |

## New Routes (no old equivalent)
(All the new analytics pages, tools, etc.)
