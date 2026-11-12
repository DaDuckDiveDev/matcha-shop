#!/usr/bin/env bash
# Sets up the Machiko shop on a fresh WordPress.
# Run it over SSH from the WordPress folder (the one that holds wp-config.php):
#   bash wp-content/themes/machiko-shop/setup/setup.sh
# It installs and switches on WooCommerce, switches on this theme, applies the
# settings for Serbia and creates the twelve products. Safe to run again.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

command -v wp > /dev/null || { echo "WP-CLI (the wp command) was not found on this server."; exit 1; }
wp core is-installed || { echo "Run this from the WordPress folder, after WordPress is installed."; exit 1; }

wp plugin is-installed woocommerce || wp plugin install woocommerce
wp plugin activate woocommerce
wp theme activate machiko-shop
wp eval-file "$HERE/setup.php"
wp eval-file "$HERE/seed-products.php"
wp rewrite structure '/%postname%/' > /dev/null
wp rewrite flush > /dev/null
wp cache flush > /dev/null 2>&1 || true
echo
echo "Done. Open the site while signed in to WordPress to see the shop;"
echo "visitors see 'coming soon' until you switch that off under WooCommerce > Settings > Site visibility."
