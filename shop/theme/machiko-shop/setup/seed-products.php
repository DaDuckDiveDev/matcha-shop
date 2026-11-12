<?php
/**
 * Creates or updates the categories and products listed in products.json.
 * Run by setup.sh through `wp eval-file`. Products are matched by SKU, so it is safe to run again.
 */
if ( ! defined( 'ABSPATH' ) || ! class_exists( 'WooCommerce' ) ) {
	fwrite( STDERR, "Run through setup.sh, with WooCommerce active.\n" );
	return;
}
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$data = json_decode( file_get_contents( __DIR__ . '/products.json' ), true );
$art  = dirname( __DIR__ ) . '/assets/products/';
if ( ! is_array( $data ) ) {
	fwrite( STDERR, "products.json could not be read.\n" );
	return;
}

/** Puts one drawing into the media library once, and returns its id. */
$image_for = function ( $slug, $title ) use ( $art ) {
	$file  = $slug . '.png';
	$found = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_machiko_source', 'meta_value' => $file, 'fields' => 'ids', 'numberposts' => 1 ) );
	if ( $found ) {
		return (int) $found[0];
	}
	if ( ! file_exists( $art . $file ) ) {
		return 0;
	}
	$upload = wp_upload_bits( 'machiko-' . $file, null, file_get_contents( $art . $file ) );
	if ( ! empty( $upload['error'] ) ) {
		return 0;
	}
	$id = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => $title, 'post_status' => 'inherit' ), $upload['file'] );
	if ( is_wp_error( $id ) || ! $id ) {
		return 0;
	}
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
	update_post_meta( $id, '_machiko_source', $file );
	update_post_meta( $id, '_wp_attachment_image_alt', $title );
	return (int) $id;
};

// ---- categories ---------------------------------------------------------------
$cat_ids = array();
foreach ( $data['categories'] as $i => $cat ) {
	$term = term_exists( $cat['slug'], 'product_cat' );
	if ( $term ) {
		wp_update_term( (int) $term['term_id'], 'product_cat', array( 'name' => $cat['name'], 'description' => $cat['description'] ) );
		$term_id = (int) $term['term_id'];
	} else {
		$made = wp_insert_term( $cat['name'], 'product_cat', array( 'slug' => $cat['slug'], 'description' => $cat['description'] ) );
		if ( is_wp_error( $made ) ) {
			continue;
		}
		$term_id = (int) $made['term_id'];
	}
	update_term_meta( $term_id, 'order', $i );
	$thumb = $image_for( $cat['image'], $cat['name'] );
	if ( $thumb ) {
		update_term_meta( $term_id, 'thumbnail_id', $thumb );
	}
	$cat_ids[ $cat['slug'] ] = $term_id;
}

// ---- products -----------------------------------------------------------------
$made = 0;
foreach ( $data['products'] as $i => $item ) {
	$id       = wc_get_product_id_by_sku( $item['sku'] );
	$variable = ! empty( $item['sizes'] );
	if ( $id ) {
		$product = wc_get_product( $id );
	} else {
		$product = $variable ? new WC_Product_Variable() : new WC_Product_Simple();
	}
	if ( ! $product ) {
		continue;
	}
	$product->set_name( $item['name'] );
	$product->set_slug( $item['slug'] );
	$product->set_sku( $item['sku'] );
	$product->set_status( 'publish' );
	$product->set_catalog_visibility( 'visible' );
	$product->set_short_description( $item['short'] );
	$product->set_description( $item['description'] );
	$product->set_menu_order( $i );
	$product->set_weight( (string) $item['weight'] );
	if ( isset( $cat_ids[ $item['category'] ] ) ) {
		$product->set_category_ids( array( $cat_ids[ $item['category'] ] ) );
	}
	$image = $image_for( $item['slug'], $item['name'] );
	if ( $image ) {
		$product->set_image_id( $image );
	}
	if ( $variable ) {
		$attribute = new WC_Product_Attribute();
		$attribute->set_name( 'Size' );
		$attribute->set_options( $item['sizes'] );
		$attribute->set_visible( true );
		$attribute->set_variation( true );
		$product->set_attributes( array( $attribute ) );
		$parent_id = $product->save();
		if ( ! $product->get_children() ) {
			foreach ( $item['sizes'] as $size ) {
				$variation = new WC_Product_Variation();
				$variation->set_parent_id( $parent_id );
				$variation->set_attributes( array( 'size' => $size ) );
				$variation->set_regular_price( (string) $item['price'] );
				$variation->set_sku( $item['sku'] . '-' . $size );
				$variation->save();
			}
		}
		WC_Product_Variable::sync( $parent_id );
	} else {
		$product->set_regular_price( (string) $item['price'] );
		$product->save();
	}
	$made++;
}
echo "Products in place: {$made}. Categories: " . count( $cat_ids ) . ".\n";
