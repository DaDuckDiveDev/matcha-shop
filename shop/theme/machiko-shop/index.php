<?php
/**
 * Ordinary pages and anything without a template of its own (basket, checkout, account, terms).
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="wrap page-main">
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'page-body' ); ?>>
			<h1 class="d2"><?php the_title(); ?></h1>
			<div class="prose"><?php the_content(); ?></div>
		</article>
	<?php endwhile; else : ?>
		<article class="page-body">
			<h1 class="d2"><?php esc_html_e( 'Nothing here', 'machiko-shop' ); ?></h1>
			<p class="lede"><?php esc_html_e( 'The page you were after is not on the shelf.', 'machiko-shop' ); ?></p>
			<p><a class="btn btn--solid" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to the shop', 'machiko-shop' ); ?></a></p>
		</article>
	<?php endif; ?>
</main>
<?php
get_footer();
