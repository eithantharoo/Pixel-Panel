# Full-app code quality & security review — 2026-08-12

Follow-up to `backend/CODE_REVIEW_MEMBERS_1_2_3.md` (which covered only Members 1/2/3's assigned files). This pass covers the rest of the backend (auth, story, infra) plus the entire frontend for the first time.

## Backend — hardening added

None of these were "on fire" in the sense of broken functionality — the server ran fine — but request-input validation was thin almost everywhere, which is exactly the kind of gap that doesn't show up until someone sends something unexpected.

| Issue | Severity | Fix |
|---|---|---|
| No global input sanitization — `req.body`/`req.query`/`req.params` were used directly in Mongo queries in several places (`authController` login/register, `storyController.getAllStories` filter, `progressController`). A `$`-prefixed key in a query/body field (e.g. `?genre[$ne]=x`, or a JSON body `{"email":{"$gt":""}}`) is not a hypothetical — Express's default query parser builds nested objects from bracket syntax, so this is reachable from a normal HTTP request, not just handcrafted Mongo driver code. | 🔴 High | Added `express-mongo-sanitize` globally in `app.js` — strips any `$`/`.`-prefixed keys from incoming request data before it reaches any controller. |
| No security headers (CSP, HSTS, X-Content-Type-Options, etc.) | 🟠 Medium | Added `helmet()` globally. |
| No rate limiting anywhere, and `/api/auth` has no account lockout — login/register were brute-forceable and crawlable at unlimited speed | 🟠 Medium | Added `express-rate-limit` on `/api/auth` specifically (20 requests / 15 min / IP) — the highest-value target, without throttling normal browsing traffic on the rest of the API. |
| `authController` register/login trusted `email`/`password` to be strings from `!email` truthiness checks alone (an object like `{"$gt":""}` passes `!email`) | 🟠 Medium | Added explicit `typeof === 'string'` guards — belt-and-suspenders on top of the global sanitizer for the most sensitive endpoint. |
| `storyController.searchStories` built a `$regex` directly from unescaped user input — a search string containing accidental (or crafted) regex metacharacters could error out the query or trigger pathological regex backtracking | 🟡 Low | Added a regex-escape helper before building the `$regex`. |
| 2 known-vulnerable transitive deps (`body-parser`, `brace-expansion`) | 🟡 Low | `npm audit fix` — clean now. |

**Left as recommendations, not fixed (would need a decision from you):**
- `express-validator` is installed but used nowhere — either wire it in for structured per-route validation or drop it from `package.json`.
- `cors()` is wide open (any origin) — fine for local dev, restrict to the real frontend origin before deploying anywhere public.

## Frontend — findings and fixes

An Explore-agent audit covered all ~30 source files for code quality, component responsibility, and UX. Findings, and what got fixed:

**Fixed:**
- **Real bug — stale closure in `ReaderPage.jsx`'s notifications.** The `useMemo` building notification click-handlers only listed `[navigate]` as a dependency, but the handlers close over `favorites`. Since the memo never recomputed, clicking a notification could act on a permanently-stale snapshot of favorites from the first render — e.g. the heart/favorite icon could show the wrong state after toggling. Fixed by adding `favorites` to the dependency array.
- **Dead code removed:** `components/layout/*` (AppLayout, Sidebar, Topbar, TrendingPanel, ContinueReadingBar — a whole parallel, unused implementation of the sidebar/header the app actually uses from `components/hub/*`), and `pages/LoginPage.jsx`/`SignUpPage.jsx` (unused duplicates of the real, routed `page-1`/`page-2` versions). Deleting the dead login/signup pages also orphaned `components/auth/BrandSidebar.jsx` and `Logo.jsx` (their only consumers) — removed those too, after confirming zero remaining importers.
- **Broken-looking UI affordances:** "Forgot Password?" and both "Continue with Google" buttons rendered as normal clickable buttons but did nothing — now marked `disabled` with a "Coming soon" tooltip and dimmed styling, so they read as intentionally unavailable instead of broken, now that the rest of auth is real and users will notice.
- **No lint tooling at all** (root cause enabling most of the above going undetected). Added a minimal flat ESLint config (`eslint.config.js`) with `eslint-plugin-react-hooks` — `npm run lint` now exists and would have caught the stale-closure bug above automatically. Running it now surfaces 4 pre-existing `exhaustive-deps` warnings in `HomePage.jsx`/`ReaderPage.jsx` (see below).

**Documented, not fixed (deliberate, to avoid risk without your sign-off):**
- `page-1/components/brandsidebar.jsx` and `page-2/components/brandsidebar.jsx` are byte-identical duplicates that should be one shared component — **but** I found the previously-existing "shared" version (`components/auth/BrandSidebar.jsx`, now deleted since it was orphaned) actually rendered different markup (extra book illustrations) than the page-1/page-2 versions. Since I can't verify which look is intended without a design reference, I left the working page-1/page-2 duplication in place rather than merge and risk a visual regression. Worth consolidating deliberately later.
- `HomePage.jsx` (445 lines) and `ReaderPage.jsx` (252 lines) are god-components: each independently reimplements keyboard-shortcut handling, live-settings sync via `storage` events, and notification-building, instead of sharing hooks. This is exactly how the stale-closure bug happened, and it'll happen again in the duplicate copy if not addressed. The remaining 4 ESLint `exhaustive-deps` warnings are in this same category (handler functions referenced by effects/memos without being memoized themselves) — real, but lower-risk than the one that was already fixed, since they reference stable-enough functions rather than frequently-changing state. **Recommend addressing this together with the next phase** (below), since that work touches these same two files anyway to swap in real data.
- No PropTypes/TypeScript — zero prop type-checking across the app. Bigger lift, flagging for awareness only.
- Naming convention split (`page-1/login_page.jsx` snake_case vs `pages/*.jsx` PascalCase) — cosmetic, low priority.

**Verified after all changes:** `npm run build` succeeds, `npm run lint` runs clean (4 pre-existing warnings, 0 errors), and the full 10-step Playwright auth regression suite from the previous session still passes end-to-end against the hardened backend.

## Next: resuming the API connection

Story browsing, favorites, continue-reading, and the reader's chapter content are still on mock data (`data/home_data.js`) — this was deliberately deferred scope from the auth pass. That's the natural next phase. Given its size (touches `HomePage.jsx`, `ReaderPage.jsx`, and pairs well with the god-component cleanup above since both mean editing the same files), I'll scope it properly with you before diving in rather than assume how much of it to do in one pass, same as last time.
