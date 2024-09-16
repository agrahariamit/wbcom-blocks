<?php
/**
 * BuddyPress Birthday
 *
 * @package           wbcom-blocks
 * @author            Wbcom Design
 * @copyright         2023 Wbcom Design
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       BuddyPress Birthday
 * Plugin URI:        https://wbcomdesigns.com/
 * Description:       Display upcoming birthdays of your members.
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


	protected function __construct() {
		$this->path     = plugin_dir_path( __FILE__ );
		$this->url      = plugin_dir_url( __FILE__ );
		$this->basename = plugin_basename( __FILE__ );

		$this->wbcom_blocks_init();
	}

	/**
	 * The method you use to get the BuddyBirthday's instance.
	 */
	public static function get_instance() : BuddyBirthday {
		$cls = static::class;
		if ( ! isset( self::$instance[ $cls ] ) ) {
			self::$instance[ $cls ] = new static();
		}

		return self::$instance[ $cls ];
	}

	public function wbcom_blocks_init() {
		add_action( 'plugins_loaded', array( $this, 'wbcom_blocks_setup_constants' ), 0 );
		add_action( 'bp_init', array( $this, 'load_textdomain' ), 2 );
		add_action( 'init', array( $this, 'wbcom_blocks_block_init' ) );
		add_filter( 'block_categories_all', array( $this, 'wbcom_blocks_add_block_category' ), 10, 2 );
	}

	/**
	 * Define constans
	 */
	public function wbcom_blocks_setup_constants() {
		define( 'wbcom_blocks_FILE', __FILE__ );
		define( 'wbcom_blocks_URL', $this->get_url() );
		define( 'wbcom_blocks_PATH', $this->get_path() );
		define( 'wbcom_blocks_TEMPLATE_PATH', $this->get_path() . '/templates/' );
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
	 * Load translation files
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'wbcom-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	public function wbcom_blocks_block_init() {
		register_block_type( __DIR__ . '/build' );
	}

	public function wbcom_blocks_add_block_category( $block_categories, $block_editor_context ) {

		if ( ! ( $block_editor_context instanceof WP_Block_Editor_Context ) ) {
			return $block_categories;
		}
		return array_merge(
			$block_categories,
			array(
				array(
					'slug'  => 'wbcom-designs',
					'title' => esc_html__( 'WBCOM Designs', 'wbcom-blocks' ),
					'icon'  => 'lightbulb', // Slug of a WordPress Dashicon or custom SVG
				),
			)
		);
	}

}

function wbcom_blocks() {
	return WbcomBlocks::get_instance();
}

wbcom_blocks();
