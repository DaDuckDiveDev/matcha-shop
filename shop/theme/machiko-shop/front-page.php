<?php
/**
 * The shop's front page: one sentence, the shelf, the three kinds of thing, the practical note.
 */
defined( 'ABSPATH' ) || exit;
get_header();
$cats = machiko_categories();
$shop = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
?>
<main id="main">
	<section class="hero wrap">
		<span class="vert hero__side" lang="ja" aria-hidden="true">お届け</span>
		<h1 class="d1"><?php esc_html_e( 'Take the bowl home.', 'machiko-shop' ); ?></h1>
		<p class="lede"><?php esc_html_e( 'Our matcha in tins, the tools to whisk it, and a few things with our name on. Sent anywhere in Serbia, or waiting for you at the counter in Dorćol.', 'machiko-shop' ); ?></p>
		<p class="hero__cta">
			<a class="btn btn--solid" href="<?php echo esc_url( $shop ); ?>"><?php esc_html_e( 'See everything', 'machiko-shop' ); ?></a>
			<a class="link" href="<?php echo esc_url( MACHIKO_SITE . '/matcha' ); ?>"><?php esc_html_e( 'About our matcha', 'machiko-shop' ); ?></a>
		</p>
	</section>

	<?php if ( shortcode_exists( 'products' ) ) : ?>
	<section class="wrap shelf">
		<h2 class="d2"><?php esc_html_e( 'On the shelf', 'machiko-shop' ); ?></h2>
		<?php echo do_shortcode( '[products limit="6" columns="3" orderby="menu_order" order="ASC"]' ); ?>
	</section>
	<?php endif; ?>

	<?php if ( $cats ) : ?>
	<section class="wrap kinds">
		<?php foreach ( $cats as $cat ) :
			$thumb = get_term_meta( $cat->term_id, 'thumbnail_id', true );
			?>
			<a class="kind" href="<?php echo esc_url( get_term_link( $cat ) ); ?>">
				<?php if ( $thumb ) { echo wp_get_attachment_image( $thumb, 'woocommerce_thumbnail', false, array( 'class' => 'kind__img', 'loading' => 'lazy' ) ); } ?>
				<span class="kind__name serif"><?php echo esc_html( $cat->name ); ?></span>
				<?php if ( $cat->description ) : ?><span class="kind__note"><?php echo esc_html( $cat->description ); ?></span><?php endif; ?>
			</a>
		<?php endforeach; ?>
	</section>
	<?php endif; ?>

	<section class="wrap">
		<div class="band">
			<h2 class="d2"><?php esc_html_e( 'Delivered, or kept for you.', 'machiko-shop' ); ?></h2>
			<p class="lede"><?php esc_html_e( 'Parcels go out by courier across Serbia. From 20 March 2027 you can also collect at Machiko and have a bowl while we wrap it.', 'machiko-shop' ); ?></p>
			<?php $delivery = machiko_page_url( 'delivery-and-returns' ); if ( $delivery ) : ?>
				<a class="btn btn--paper" href="<?php echo esc_url( $delivery ); ?>"><?php esc_html_e( 'Delivery and returns', 'machiko-shop' ); ?></a>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php
get_footer();
