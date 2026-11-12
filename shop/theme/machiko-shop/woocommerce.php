<?php
/**
 * Every WooCommerce page (the shop, a category, one product) inside the theme's frame.
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="wrap shop-main">
	<?php woocommerce_content(); ?>
</main>
<?php
get_footer();
