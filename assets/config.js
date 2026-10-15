/* ==========================================================
   SINGLE CONFIG FILE — every monetisation hook lives here.
   All values are intentionally EMPTY placeholders. Nothing is
   shown to visitors until a value is filled in.
   ========================================================== */
window.SITE_CONFIG = {
  siteName: "Sole Trader Kit AU",
  baseUrl: "https://christransformers.github.io/soletrader-kit-au", // TODO: change if you add a custom domain

  // TODO(Chris): Create a Stripe Payment Link (or Gumroad / Lemon Squeezy product) for the
  // "Pro Pack" and paste the URL here. Empty = Pro buttons are hidden.
  proPackUrl: "",
  proPackPrice: "A$19",

  // TODO(Chris): Affiliate links for accounting software (apply via each vendor's partner program).
  // Empty = the recommendation box is hidden.
  affiliates: {
    xero: "",        // e.g. Xero partner/referral link
    myob: "",        // e.g. MYOB affiliate link
    quickbooks: ""   // e.g. QuickBooks AU affiliate link
  },

  // TODO(optional): Analytics. Plausible domain OR GA4 measurement ID. Empty = no tracking scripts load.
  analytics: { plausibleDomain: "", ga4Id: "" },

  // TODO(optional): Google AdSense publisher id (ca-pub-XXXX). Empty = no ads.
  adsenseClient: "",

  contactEmail: "" // TODO: optional contact address shown in footer
};
