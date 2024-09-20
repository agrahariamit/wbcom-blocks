<?php
/**
 * Wbcom Designs
 *
 * @package           wbcom-blocks
 * @author            Wbcom Design
 * @copyright         2023 Wbcom Design
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Wbcom Designs Blocks
 * Plugin URI:        https://wbcomdesigns.com/
 * Description:       The Wbcom Designs Blocks Plugin
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Wbcom Design
 * Author URI:        https://wbcomdesigns.com/
 * Text Domain:       wbcom-blocks
 * License:           GPL v2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 */

class WbcomBlocks {
	/**
	 * Singleton instance of the WbcomBlocks class.
	 *
	 * This class is responsible for initializing and managing the Wbcom Designs Blocks plugin.
	 * It provides methods for setting up constants, loading translations, registering custom Gutenberg blocks,
	 * and adding a custom block category.
	 *
	 * @var array
	 */
	private static $instance = array();

	/**
	 * Absolute path to this plugin directory.
	 *
	 * @var string
	 */
	private $path;

	/**
	 * Absolute url to this plugin directory.
	 *
	 * @var string
	 */
	private $url;

	/**
	 * Plugin basename.
	 *
	 * @var string
	 */
	private $basename;


	/**
	 * Constructor for the WbcomBlocks class.
	 *
	 * Initializes the plugin by setting up constants, loading translations,
	 * registering custom Gutenberg blocks, and adding a custom block category.
	 *
	 * @return void
	 */
	protected function __construct() {
		$this->path     = plugin_dir_path( __FILE__ );
		$this->url      = plugin_dir_url( __FILE__ );
		$this->basename = plugin_basename( __FILE__ );

		$this->wbcom_blocks_init();
		$this->include();
	}

	/**
	 * The method you use to get the WbcomBlocks's instance.
	 */
	public static function get_instance(): WbcomBlocks {
		$cls = static::class;
		if ( ! isset( self::$instance[ $cls ] ) ) {
			self::$instance[ $cls ] = new static();
		}

		return self::$instance[ $cls ];
	}

	/**
	 * Initializes the plugin by setting up constants, loading translations,
	 * registering custom Gutenberg blocks, and adding a custom block category.
	 *
	 * This function hooks into several WordPress actions and filters:
	 * - 'plugins_loaded' to setup constants.
	 * - 'bp_init' to load translations.
	 * - 'init' to register custom Gutenberg blocks.
	 * - 'block_categories_all' to add a custom block category.
	 *
	 * @return void
	 */
	public function wbcom_blocks_init() {
		add_action( 'plugins_loaded', array( $this, 'wbcom_blocks_setup_constants' ), 0 );
		add_action( 'bp_init', array( $this, 'load_textdomain' ), 2 );
		add_action( 'init', array( $this, 'wbcom_blocks_block_init' ) );
		add_filter( 'block_categories_all', array( $this, 'wbcom_blocks_add_block_category' ), 10, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_wbcom_blocks_assets' ) );
	}

	/**
	 * Define constans
	 */
	public function wbcom_blocks_setup_constants() {
		define( 'WBCOM_BLOCKS_FILE', __FILE__ );
		define( 'WBCOM_BLOCKS_URL', $this->get_url() );
		define( 'WBCOM_BLOCKS_PATH', $this->get_path() );
		define( 'WBCOM_BLOCKS_TEMPLATE_PATH', $this->get_path() . '/templates/' );
	}

	/**
	 * Get plugin url
	 */
	public function get_url() {
		return $this->url;
	}

	/**
	 * Get Plugin Path
	 */
	public function get_path() {
		return $this->path;
	}

	/**
	 * Includes the necessary API class for BuddyPress birthday related functionality.
	 *
	 * This function is responsible for including the 'class-api-buddypress-birthday.php' file
	 * located in the 'includes/api' directory of the plugin. This file contains the necessary
	 * functionality for interacting with BuddyPress birthday data.
	 *
	 * @return void
	 */
	public function include() {
		require_once $this->get_path() . '/includes/api/class-api-buddypress-birthday.php';
	}

	/**
	 * Load translation files
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'wbcom-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Initializes and registers custom Gutenberg blocks.
	 *
	 * This function registers four custom Gutenberg blocks:
	 * - Flipbox
	 * - BuddyPress Birthday
	 * - BuddyPress Members
	 * - BuddyPress Activity Listing
	 * - Heading
	 *
	 * The blocks are located in the 'build' directory of the plugin.
	 *
	 * @return void
	 */
	public function wbcom_blocks_block_init() {
		$blocks = array(
			'buddypress-birthday',
			'buddypress-members',
			'buddypress-activity-listing',
			'flipbox',
			'heading',
		);

		foreach ( $blocks as $block ) {
			register_block_type( __DIR__ . '/build/blocks/' . $block );
		}
	}

	/**
	 * Adds a custom block category for the Wbcom Designs plugin.
	 *
	 * This function filters the existing block categories and adds a new category for the Wbcom Designs plugin.
	 * The new category is identified by the slug 'wbcom-designs' and has a title 'Wbcom Designs'.
	 *
	 * @param array                   $block_categories An array of existing block categories.
	 * @param WP_Block_Editor_Context $block_editor_context The context of the block editor.
	 *
	 * @return array The modified array of block categories.
	 */
	public function wbcom_blocks_add_block_category( $block_categories, $block_editor_context ) {

		if ( ! ( $block_editor_context instanceof WP_Block_Editor_Context ) ) {
			return $block_categories;
		}
		return array_merge(
			$block_categories,
			array(
				array(
					'slug'  => 'wbcom-designs',
					'title' => __( 'Wbcom Designs', 'wbcom-blocks' ),
					'icon'  => 'lightbulb', // Slug of a WordPress Dashicon or custom SVG
				),
			)
		);
	}

	/**
	 * Enqueue Swiper.js and related assets for the BuddyPress Members Block.
	 */
	public function enqueue_wbcom_blocks_assets() {
		// Enqueue Swiper CSS.
		wp_enqueue_style( 'swiper', 'https://unpkg.com/swiper/swiper-bundle.min.css', array(), '11.1.12' );

		// Enqueue Swiper JS.
		wp_enqueue_script( 'swiper', 'https://unpkg.com/swiper/swiper-bundle.min.js', array(), '11.1.12', true );
	}
}

function wbcom_blocks() {
	return WbcomBlocks::get_instance();
}

wbcom_blocks();
