<?php
/**
 * The shop's settings for Serbia. Run by setup.sh through `wp eval-file`.
 * Safe to run again: nothing is created twice.
 */
if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WooCommerce' ) ) {
	fwrite( STDERR, "Run through setup.sh, with WooCommerce active.\n" );
	return;
}

// ---- the basics -------------------------------------------------------------
$options = array(
	'blogname'                                 => 'Machiko Shop',
	'blogdescription'                          => 'Matcha, tools and Machiko things',
	'woocommerce_default_country'              => 'RS:RS00',          // Belgrade
	'woocommerce_currency'                     => 'RSD',
	'woocommerce_currency_pos'                 => 'right_space',      // 2.900 RSD
	'woocommerce_price_thousand_sep'           => '.',
	'woocommerce_price_decimal_sep'            => ',',
	'woocommerce_price_num_decimals'           => '0',
	'woocommerce_allowed_countries'            => 'specific',
	'woocommerce_specific_allowed_countries'   => array( 'RS' ),
	'woocommerce_ship_to_countries'            => '',
	'woocommerce_weight_unit'                  => 'kg',
	'woocommerce_dimension_unit'               => 'cm',
	'woocommerce_enable_guest_checkout'        => 'yes',
	'woocommerce_enable_reviews'               => 'no',
	// Prices are entered and shown with PDV included. The rate is added below.
	'woocommerce_calc_taxes'                   => 'yes',
	'woocommerce_prices_include_tax'           => 'yes',
	'woocommerce_tax_display_shop'             => 'incl',
	'woocommerce_tax_display_cart'             => 'incl',
	'woocommerce_tax_total_display'            => 'single',
	'woocommerce_coming_soon'                  => 'yes',              // the shop stays behind "coming soon" until you switch it off
);
foreach ( $options as $name => $value ) {
	update_option( $name, $value );
}

// ---- PDV: 20% on everything, to be confirmed with the accountant -----------------
global $wpdb;
$has_rate = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}woocommerce_tax_rates WHERE tax_rate_country = 'RS'" );
if ( ! $has_rate ) {
	WC_Tax::_insert_tax_rate( array(
		'tax_rate_country'  => 'RS',
		'tax_rate_state'    => '',
		'tax_rate'          => '20.0000',
		'tax_rate_name'     => 'PDV',
		'tax_rate_priority' => 1,
		'tax_rate_compound' => 0,
		'tax_rate_shipping' => 1,
		'tax_rate_order'    => 0,
		'tax_rate_class'    => '',
	) );
}

// ---- delivery: courier, free above a basket size, or collect in Dorćol ---------
$zone_exists = false;
foreach ( WC_Shipping_Zones::get_zones() as $existing ) {
	if ( 'Srbija' === $existing['zone_name'] ) {
		$zone_exists = true;
	}
}
if ( ! $zone_exists ) {
	$zone = new WC_Shipping_Zone();
	$zone->set_zone_name( 'Srbija' );
	$zone->add_location( 'RS', 'country' );
	$zone->save();

	$flat = $zone->add_shipping_method( 'flat_rate' );
	update_option( "woocommerce_flat_rate_{$flat}_settings", array( 'title' => 'Courier, 1 to 3 working days', 'tax_status' => 'taxable', 'cost' => '450' ) );

	$free = $zone->add_shipping_method( 'free_shipping' );
	update_option( "woocommerce_free_shipping_{$free}_settings", array( 'title' => 'Free delivery', 'requires' => 'min_amount', 'min_amount' => '8000' ) );

	$pickup = $zone->add_shipping_method( 'local_pickup' );
	update_option( "woocommerce_local_pickup_{$pickup}_settings", array( 'title' => 'Collect at Machiko, Dorćol (from 20 March 2027)', 'tax_status' => 'none', 'cost' => '' ) );
}

// ---- payment: pay the courier or pay at the counter. Cards need a bank contract. --
$cod = get_option( 'woocommerce_cod_settings', array() );
update_option( 'woocommerce_cod_settings', array_merge( is_array( $cod ) ? $cod : array(), array(
	'enabled'            => 'yes',
	'title'              => 'Pay on delivery',
	'description'        => 'Pay the courier in cash when the parcel arrives, or pay at the counter when you collect.',
	'instructions'       => 'You pay when the parcel arrives or when you collect it.',
	'enable_for_virtual' => 'no',
) ) );

// ---- pages: WooCommerce's own, and three help pages left as drafts ---------------
WC_Install::create_pages();
$drafts = array(
	'delivery-and-returns' => array( 'Delivery and returns', "<h2>Delivery</h2><p>[Courier, price, days, areas.]</p><h2>Collecting your order</h2><p>[Address and hours, from 20 March 2027.]</p><h2>Changing your mind</h2><p>[The period for withdrawing from a purchase made at a distance, how to tell us, who pays the return postage, when the refund is made. To be written with the lawyer.]</p><h2>If something is wrong</h2><p>[How to make a complaint and how quickly we answer. To be written with the lawyer.]</p>" ),
	'terms'                => array( 'Terms of sale', "<p>[Company name, address, registration number (MB) and tax number (PIB).]</p><p>[Prices, payment, delivery, withdrawal, complaints. To be written with the lawyer.]</p>" ),
	'privacy'              => array( 'Privacy', "<p>[What the shop stores about a customer, why, for how long and who else sees it. To be checked against the ZZPL.]</p>" ),
);
foreach ( $drafts as $slug => $page ) {
	if ( ! get_page_by_path( $slug ) ) {
		wp_insert_post( array( 'post_type' => 'page', 'post_name' => $slug, 'post_title' => $page[0], 'post_content' => $page[1], 'post_status' => 'draft' ) );
	}
}

echo "Settings done: RSD, Serbia only, PDV 20% included, courier 450 RSD (free from 8.000 RSD), collection, pay on delivery. The shop is in 'coming soon' mode.\n";
