<?php
/**
 * The foot of every page, with the way back to the matcha house.
 */
defined( 'ABSPATH' ) || exit;
$cats  = machiko_categories();
$help  = array(
	'delivery-and-returns' => __( 'Delivery and returns', 'machiko-shop' ),
	'terms'                => __( 'Terms of sale', 'machiko-shop' ),
	'privacy'              => __( 'Privacy', 'machiko-shop' ),
);
?>
<footer class="foot">
	<div class="wrap">
		<div class="foot__cols">
			<div class="foot__col">
				<p class="d3 serif"><?php esc_html_e( 'An hour of Kyoto, to take home.', 'machiko-shop' ); ?></p>
			</div>
			<div class="foot__col">
				<h2><?php esc_html_e( 'Shop', 'machiko-shop' ); ?></h2>
				<?php if ( function_exists( 'wc_get_page_permalink' ) ) : ?>
					<a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>"><?php esc_html_e( 'Everything', 'machiko-shop' ); ?></a>
				<?php endif; ?>
				<?php foreach ( $cats as $cat ) : ?>
					<a href="<?php echo esc_url( get_term_link( $cat ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
				<?php endforeach; ?>
			</div>
			<div class="foot__col">
				<h2><?php esc_html_e( 'Help', 'machiko-shop' ); ?></h2>
				<?php foreach ( $help as $slug => $label ) : $url = machiko_page_url( $slug ); if ( $url ) : ?>
					<a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $label ); ?></a>
				<?php endif; endforeach; ?>
				<a href="mailto:hello@machiko.rs">hello@machiko.rs</a>
			</div>
			<div class="foot__col">
				<h2><?php esc_html_e( 'The matcha house', 'machiko-shop' ); ?></h2>
				<a href="<?php echo esc_url( MACHIKO_SITE ); ?>">machiko.rs</a>
				<a href="<?php echo esc_url( MACHIKO_SITE . '/menu' ); ?>"><?php esc_html_e( 'Menu', 'machiko-shop' ); ?></a>
				<a href="<?php echo esc_url( MACHIKO_SITE . '/matcha' ); ?>"><?php esc_html_e( 'Our matcha', 'machiko-shop' ); ?></a>
				<a href="<?php echo esc_url( MACHIKO_SITE . '/visit' ); ?>"><?php esc_html_e( 'Visit', 'machiko-shop' ); ?></a>
			</div>
		</div>
		<div class="foot__word" aria-hidden="true">Machiko<span class="vert" lang="ja">まちこ</span></div>
		<div class="foot__base">
			<span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Machiko</span>
			<span><?php esc_html_e( 'Dorćol, Belgrade', 'machiko-shop' ); ?></span>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
