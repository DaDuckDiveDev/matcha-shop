<?php
/**
 * The top of every page: one floating pill, as on machiko.rs.
 */
defined( 'ABSPATH' ) || exit;
$cats = machiko_categories();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip" href="#main"><?php esc_html_e( 'Skip to the page', 'machiko-shop' ); ?></a>
<header class="nav">
	<div class="nav__pill">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php echo machiko_mark( 26 ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<span>Machiko</span><span class="brand__sub"><?php esc_html_e( 'shop', 'machiko-shop' ); ?></span>
		</a>
		<?php if ( $cats ) : ?>
		<nav class="nav__links" aria-label="<?php esc_attr_e( 'Shop', 'machiko-shop' ); ?>">
			<?php foreach ( $cats as $cat ) : ?>
				<a href="<?php echo esc_url( get_term_link( $cat ) ); ?>"<?php echo is_product_category( $cat->slug ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $cat->name ); ?></a>
			<?php endforeach; ?>
		</nav>
		<?php endif; ?>
		<div class="nav__end">
			<a class="nav__back" href="<?php echo esc_url( MACHIKO_SITE ); ?>"><?php esc_html_e( 'The matcha house', 'machiko-shop' ); ?></a>
			<?php if ( function_exists( 'wc_get_cart_url' ) ) : ?>
			<a class="btn btn--solid btn--sm cart-link" href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'Basket', 'machiko-shop' ); ?> <span class="cart-count"><?php echo (int) machiko_cart_count(); ?></span></a>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( $cats ) : ?>
	<nav class="nav__row" aria-label="<?php esc_attr_e( 'Shop', 'machiko-shop' ); ?>">
		<?php foreach ( $cats as $cat ) : ?>
			<a href="<?php echo esc_url( get_term_link( $cat ) ); ?>"<?php echo is_product_category( $cat->slug ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $cat->name ); ?></a>
		<?php endforeach; ?>
	</nav>
	<?php endif; ?>
</header>
