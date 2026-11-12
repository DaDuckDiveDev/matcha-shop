<?php
/**
 * Machiko Shop: the shop's theme. It carries the look of machiko.rs (washi white,
 * sumi ink, one green, Hina Mincho and Hanken Grotesk) onto WooCommerce's own
 * templates, so WooCommerce updates keep working without template overrides.
 */
defined( 'ABSPATH' ) || exit;

/** The main website, for the links back to it. */
if ( ! defined( 'MACHIKO_SITE' ) ) {
	define( 'MACHIKO_SITE', 'https://machiko.rs' );
}

add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'machiko-shop', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 720,
		'single_image_width'    => 1200,
		'product_grid'          => array( 'default_rows' => 4, 'default_columns' => 3, 'min_columns' => 2, 'max_columns' => 4 ),
	) );
	add_theme_support( 'wc-product-gallery-slider' );
	add_theme_support( 'wc-product-gallery-lightbox' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'machiko-shop', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
}, 20 );

/** The two fonts every page uses, fetched early. */
add_action( 'wp_head', function () {
	$fonts = get_template_directory_uri() . '/assets/fonts/';
	foreach ( array( 'hina-mincho-latin-400-normal.woff2', 'hanken-grotesk-latin-wght-normal.woff2' ) as $file ) {
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $fonts . $file ) );
	}
	echo '<meta name="theme-color" content="#FBFAF6">' . "\n";
}, 1 );

/** The mark: a bowl of usucha seen from above. Same drawing as on machiko.rs. */
function machiko_mark( $size = 26, $cream = false ) {
	$fill  = $cream ? '#F4F0E4' : '#3E5A33';
	$gleam = $cream ? '#3E5A33' : '#F4F0E4';
	return sprintf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M47 12 C68 9 91 27 90 50 C89 72 74 86 50 86 C26 86 10 73 10.5 50 C11 28 27 14 47 12 Z" fill="%2$s"/><path d="M27 44 C28 33 36 25 47 23" fill="none" stroke="%3$s" stroke-width="4.4" stroke-linecap="round"/></svg>',
		(int) $size, esc_attr( $fill ), esc_attr( $gleam )
	);
}

/** Top-level product categories, in menu order, for the header and footer. */
function machiko_categories() {
	if ( ! taxonomy_exists( 'product_cat' ) ) {
		return array();
	}
	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'parent' => 0, 'hide_empty' => true, 'orderby' => 'menu_order' ) );
	if ( is_wp_error( $terms ) ) {
		return array();
	}
	return array_values( array_filter( $terms, function ( $term ) {
		return 'uncategorized' !== $term->slug;
	} ) );
}

/** How many things are in the basket. */
function machiko_cart_count() {
	return ( function_exists( 'WC' ) && WC()->cart ) ? (int) WC()->cart->get_cart_contents_count() : 0;
}

/** A page's address by its slug, or an empty string while the page is missing or still a draft. */
function machiko_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	return ( $page && 'publish' === $page->post_status ) ? get_permalink( $page ) : '';
}

if ( class_exists( 'WooCommerce' ) ) {
	// Three across, twelve to a page; no sidebar; three related products.
	add_filter( 'loop_shop_columns', function () { return 3; } );
	add_filter( 'loop_shop_per_page', function () { return 12; } );
	add_filter( 'woocommerce_output_related_products_args', function ( $args ) {
		return array_merge( $args, array( 'posts_per_page' => 3, 'columns' => 3 ) );
	} );
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

	// The basket count in the header follows "Add to basket" without a page reload.
	add_filter( 'woocommerce_add_to_cart_fragments', function ( $fragments ) {
		$fragments['span.cart-count'] = '<span class="cart-count">' . machiko_cart_count() . '</span>';
		return $fragments;
	} );

	// Plain words on the buttons.
	add_filter( 'woocommerce_product_add_to_cart_text', function ( $text, $product ) {
		return ( $product && $product->is_type( 'simple' ) && $product->is_purchasable() && $product->is_in_stock() ) ? __( 'Add to basket', 'machiko-shop' ) : $text;
	}, 10, 2 );
	add_filter( 'woocommerce_product_single_add_to_cart_text', function () {
		return __( 'Add to basket', 'machiko-shop' );
	} );

	// The description sits under the product as plain sections; no tab strip.
	add_filter( 'woocommerce_product_description_heading', '__return_null' );
	add_filter( 'woocommerce_product_additional_information_heading', '__return_null' );
}
