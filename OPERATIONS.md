# OPERATIONS — Sole Trader Kit AU

## The business in one line
Free, genuinely useful AU invoicing tools capture search traffic from sole traders/freelancers
("tax invoice template australia", "GST calculator", "<trade> invoice template"); revenue comes from
(1) a one-off paid **Pro Pack** of templates, (2) **accounting-software affiliate** links, (3) optional **display ads**.

## Why this model (research summary, Oct 2026)
Five candidates were scored (1–5, higher = better; legal risk scored as "safety"):

| Model | Demand | Competition | Time-to-$ | Automation | Fit | Safety | Total |
|---|---|---|---|---|---|---|---|
| **AU tax-invoice generator + GST/ABN tools (chosen)** | 4 | 3 | 3 | 5 | 4 | 5 | **24** |
| AU workplace calculators (pay, leave, redundancy) | 5 | 1 | 2 | 4 | 4 | 3 | 19 |
| AU legal document generator (wills, leases) | 4 | 3 | 3 | 3 | 5 | 1 | 19 |
| Niche Notion/Docs template store (Gumroad) | 3 | 2 | 3 | 4 | 3 | 5 | 20 |
| Curated AU legal-tech directory w/ paid listings | 2 | 3 | 2 | 2 | 5 | 4 | 18 |

Evidence (qualitative — no search-volume numbers were verifiable without a paid keyword tool, so none are claimed):
- Rules are stable, public and simple to encode: the ATO lists the 7 required details for tax invoices under $1,000 and the extra buyer-ID rule at $1,000+ — https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices/
- Government itself distributes only .docx templates (no online generator) — https://business.gov.au/finance/payments-and-invoicing/how-to-invoice — a gap for a fast, private, browser tool.
- Commercial demand exists: invoicing SaaS vendors run SEO pages targeting exactly this query (e.g. Billdu's AU sole-trader templates page — https://www.billdu.com/invoice-template/sole-trader-invoice-templates-australia/).
- Workplace calculators were rejected: already crowded with dedicated sites (workcalc.com.au, leavecalculator.au, wagecalculator.com.au) plus the free Fair Work P.A.C.T. tool, and award rates change yearly (maintenance + accuracy risk).
- Legal document generators were rejected: wills/leases edge into legal practice/advice regulation and need ongoing human review.

## What is automated (zero human ops)
- Hosting: GitHub Pages (free), deployed by `.github/workflows/pages.yml` on every push + weekly rebuild.
- All tools run client-side; no server, no database, no user data stored by us, no support queue.
- Programmatic SEO: `scripts/build.js` turns `data/trades.json` into one landing page per trade and regenerates `sitemap.xml`.
- Monetisation slots are pre-wired: filling a value in `assets/config.js` makes the Pro button / affiliate box / analytics / ads appear site-wide.
- Pro Pack delivery (once set up) is handled entirely by Stripe/Gumroad/Lemon Squeezy file delivery.

## One-time setup only Chris can do (≈1–2 hours total)
1. **Enable Pages** (if not already live): repo Settings → Pages → Source: **GitHub Actions**. Then re-run the workflow.
2. **Payment + product:** create a Gumroad / Lemon Squeezy product (they handle file delivery and act as merchant of record) or a Stripe Payment Link, upload the Pro Pack files (Word/Google Docs invoice, quote, receipt templates + reminder email scripts — build them once from this site's layout), paste the URL into `proPackUrl` in `assets/config.js`.
3. **Affiliates / ads (optional):** apply to Xero, MYOB and/or QuickBooks partner/affiliate programs and paste links into `affiliates`; apply for AdSense after some traffic; add Plausible/GA4 id. Optionally buy a domain (e.g. `.com.au` needs an ABN — Chris has one) and add a `CNAME` file + update `baseUrl`/`BASE`/robots.txt.

Then submit `sitemap.xml` in Google Search Console (verify via HTML file upload to the repo).

## Growth plan
- Week 1: Search Console + Bing Webmaster submission; post the free tool once in relevant communities where self-promotion is allowed (e.g. r/AusFinance weekly threads, sole-trader Facebook groups) — no spam.
- Month 1–3: expand `data/trades.json` to 100+ trades; add quote generator, receipt generator, late-payment interest page (all same pattern).
- Offer an embeddable "GST calculator widget" snippet for backlinks.
- Track which trade pages get impressions in Search Console and deepen those.

## Optional agentic content loop
A scheduled agent (or a Grok Bot task) can, monthly: read Search Console queries → append new trades/queries to `data/trades.json` (fields: slug, name, items, tip) → open a PR. Merging triggers the workflow, which runs `node scripts/build.js` and redeploys. Guardrails: tips must stay general, cite ATO/business.gov.au, no invented statistics, no tax advice.

## Compliance notes
- "General information only" disclaimers on every page; not a registered tax/BAS agent.
- ABN checker validates format only and links to official ABN Lookup.
- Affiliate links use `rel="sponsored"` and are disclosed.
- Review ATO tax-invoice rules annually (they have been stable for years).
