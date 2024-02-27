<?php
/**
 * Plugin Name:       Reign News Widget
 * Description:       A Gutenberg block to display the latest blog posts with options for title, number of posts, and category selection.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Wbcom Designs
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       reign-news
 *
 * @package           reign-news-block
 */

function reign_news_widget_enqueue_scripts() {
	if ( is_admin() ) {
		// Enqueue editor script
		wp_enqueue_script(
			'reign-news-widget-editor',
			plugins_url( '/build/index.js', __FILE__ ),
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // WordPress editor dependencies
			'1.0.0',
			true
		);
	} else {
		// Enqueue frontend script
		wp_enqueue_script(
			'reign-news-widget-frontend',
			plugins_url( '/build/frontend.js', __FILE__ ),
			array(), // No WordPress editor dependencies
			'1.0.0',
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'reign_news_widget_enqueue_scripts' );


function reign_news_widget_block_init() {
	register_block_type_from_metadata( __DIR__ );
}

add_action( 'init', 'reign_news_widget_block_init' );
