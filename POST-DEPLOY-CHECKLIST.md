# Post-Deploy Verification Checklist

Run these checks after deploying to verify the site is working correctly.

## Critical Pages (must work)
- [ ] Home page loads at https://bmfffl.vercel.app/
- [ ] /owners — all 12 owner cards visible
- [ ] /analytics — analytics hub page loads
- [ ] /analytics/dynasty-power-index — main analytics tool
- [ ] /history/standings — historical standings
- [ ] /season/matchups — current season matchups

## Navigation
- [ ] Desktop nav dropdowns open correctly
- [ ] Mobile hamburger menu works (test at 375px)
- [ ] Dark/light mode toggle works and persists

## Tools
- [ ] /analytics/trade-evaluator — interactive verdict works
- [ ] /analytics/team-builder — can build roster
- [ ] /analytics/playoff-simulator — bracket toggles work

## SEO
- [ ] https://bmfffl.vercel.app/sitemap.xml is accessible
- [ ] https://bmfffl.vercel.app/robots.txt is accessible

## Environment
- [ ] League ID shows in any Sleeper-connected page
- [ ] No console errors on home page

## Redirects
- [ ] /matchups redirects to /season/matchups
- [ ] /standings redirects to /history/standings
