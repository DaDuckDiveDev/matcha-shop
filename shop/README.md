# Machiko Shop (WooCommerce)

A shop for the things Machiko sells beyond the counter: tins of matcha, the tools
to whisk it, and a few things with the name on. It is a separate WordPress with
WooCommerce, meant for **shop.machiko.rs**, wearing the look of machiko.rs. The
main website stays as it is, a fast static site; the two link to each other.

## What is here

| Path | What |
|---|---|
| `theme/machiko-shop/` | The theme: header, footer, front page and one stylesheet. It restyles WooCommerce's own templates and overrides none of them, so WooCommerce updates keep working. Same typefaces, colours, pill navigation and footer wordmark as the website. |
| `theme/machiko-shop/setup/setup.sh` | One command that sets the shop up on a fresh WordPress (below). |
| `theme/machiko-shop/setup/setup.php` | The settings it applies: dinars (2.900 RSD), Serbia only, PDV 20% included in prices, courier 450 RSD (free from 8.000 RSD), collection in Dorćol, pay on delivery, the shop left in "coming soon". |
| `theme/machiko-shop/setup/products.json` | Three categories and twelve products with prices and descriptions. **The prices are placeholders.** |
| `theme/machiko-shop/assets/products/` | A drawing for each product, until the real things are photographed. `node shop/art.mjs` draws them again. |
| `../.github/workflows/shop.yml` | Uploads the theme to the shop by SFTP on every change, once the shop exists. |

## Put it on SiteGround (once)

1. **Create the site.** In SiteGround add the subdomain `shop.machiko.rs` and install
   WordPress on it (the installer offers "WordPress + WooCommerce"; either is fine).
   Turn on SSL and HTTPS Enforce for it.
2. **Let the deploy key in.** Give the SFTP key that deploys machiko.rs access to
   this site too.
3. **Tell GitHub where it is.** Repository → Settings → Secrets and variables →
   Actions → Variables → `SHOP_REMOTE_DIR` = the shop's WordPress folder as SFTP
   shows it. For machiko.rs that folder is `/machiko.rs/machiko.rs/public_html`, so
   expect `/machiko.rs/shop.machiko.rs/public_html` or
   `/shop.machiko.rs/shop.machiko.rs/public_html`.
4. **Upload the theme.** Actions → "Shop theme" → Run workflow.
5. **Run the set-up**, over SSH, from the shop's WordPress folder:
   ```bash
   bash wp-content/themes/machiko-shop/setup/setup.sh
   ```
6. **Look at it** while signed in to WordPress. Visitors see "coming soon" until you
   switch that off under WooCommerce → Settings → Site visibility.

## Before it opens

- **Prices and stock.** Every price is a placeholder. Edit `products.json` and run
  the set-up again, or edit the products in WordPress.
- **The three help pages** (Delivery and returns, Terms of sale, Privacy) are
  created as drafts with the headings to fill in. They appear in the footer once
  published. They are for the lawyer.
- **Company details.** Serbian shops must show the company name, address, MB and
  PIB; put them on the Terms page and in WooCommerce → Settings → General.
- **Card payments** need a contract with a bank. Banca Intesa, Raiffeisen and the
  NestPay banks each have a WooCommerce plugin; the bank supplies the keys. Until
  then the shop takes payment on delivery and at the counter.
- **Bank transfer with an IPS QR code**: the plugin "Serbian Addons for
  WooCommerce" adds a payment slip and the NBS QR code, and company fields at
  checkout. It was last updated two years ago, so try it on a copy first.
- **Fiscal receipts.** Every retail sale online needs a fiscal receipt; a seller
  who sells only online may issue it electronically. Set this up with the
  accountant before the first order (there is a plugin, HAfiscal for WooCommerce).
- **PDV.** The set-up assumes 20% on everything, included in the prices. Confirm
  the rate for tea and for goods with the accountant.
- **Discounts.** Under the trade and consumer laws that apply from 2026, a
  discount must show the lowest price of the previous 30 days.
- **Serbian.** The shop starts in English. WordPress's Serbian is Cyrillic; a
  Latin shop needs the `sr_RS` language packs plus a transliteration plugin, or
  a multilingual plugin for both languages. Decide before opening.
- **Photographs** of the real products replace the drawings.

## What has and has not been tested

Every PHP file passes a syntax check, and the stylesheet was checked in a
browser, desktop and phone, against a stand-in for WooCommerce's markup and
layout rules. **It has not yet run on a real WordPress**: step 5 is the first
real test, and the basket, checkout and account pages are the ones to look at
closely.
