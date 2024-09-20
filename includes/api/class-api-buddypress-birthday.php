<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class to extend BuddyPress REST API and register custom endpoint using Singleton pattern.
 */
class BP_Birthday_API {

	/**
	 * Holds the single instance of the class.
	 *
	 * @var BP_Birthday_API|null
	 */
	private static $instance = null;

	/**
	 * Private constructor to prevent multiple instances.
	 */
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Prevent object cloning.
	 */
	private function __clone() {}

	/**
	 * Prevent object unserialization.
	 */
	private function __wakeup() {}

	/**
	 * Get the singleton instance of the class.
	 *
	 * @return BP_Birthday_API
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Registers the custom API route.
	 */
	public function register_routes() {
		register_rest_route(
			bp_rest_namespace() . '/' . bp_rest_version(),
			'/birthdays/(?P<id>[\d]+)', // Add member ID as a URL parameter
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						},
					),
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to read a user.
	 *
	 * @since 5.0.0
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		$retval = new WP_Error(
			'bp_rest_authorization_required',
			__( 'Sorry, you are not allowed to perform this action.', 'buddypress' ),
			array(
				'status' => rest_authorization_required_code(),
			)
		);

		if ( bp_current_user_can( 'bp_view', array( 'bp_component' => 'members' ) ) ) {
			$user = bp_rest_get_user( $request->get_param( 'id' ) );

			if ( ! $user instanceof WP_User ) {
				$retval = new WP_Error(
					'bp_rest_member_invalid_id',
					__( 'Invalid member ID.', 'buddypress' ),
					array(
						'status' => 404,
					)
				);
			} elseif ( 'edit' === $request->get_param( 'context' ) ) {
				if ( get_current_user_id() === $user->ID || bp_current_user_can( 'list_users' ) ) {
					$retval = true;
				} else {
					$retval = new WP_Error(
						'bp_rest_authorization_required',
						__( 'Sorry, you are not allowed to view members with the edit context.', 'buddypress' ),
						array(
							'status' => rest_authorization_required_code(),
						)
					);
				}
			} else {
				$retval = true;
			}
		}

		/**
		 * Filter the members `get_item` permissions check.
		 *
		 * @since 5.0.0
		 *
		 * @param true|WP_Error   $retval  Returned value.
		 * @param WP_REST_Request $request The request sent to the API.
		 */
		return apply_filters( 'bp_rest_members_get_item_permissions_check', $retval, $request );
	}

	/**
	 * Callback for the API route. Retrieves BuddyPress xProfile fields.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$args = array(
			'user_id'             => $request->get_param( 'id' ),
			'show_birthdays_of'   => $request->get_param( 'birthdays' ),
			'birthday_field_name' => $request->get_param( 'fields' ),
			'limit'               => $request->get_param( 'limit' ),
		);

		if ( isset( $args['show_birthdays_of'] ) && 'friends' === $args['show_birthdays_of'] && bp_is_active( 'friends' ) ) {
			$members = friends_get_friend_user_ids( $args['user_id'] );
		} elseif ( isset( $args['show_birthdays_of'] ) && 'followers' === $args['show_birthdays_of'] ) {
			if ( function_exists( 'bp_follow_get_following' ) ) {
				$members = bp_follow_get_following(
					array(
						'user_id' => $args['user_id'],
					)
				);
			} elseif ( function_exists( 'bp_get_following_ids' ) ) {
				$members = bp_get_following_ids(
					array(
						'user_id' => $args['user_id'],
					)
				);

				$members = explode( ',', $members );
			}
		}

		$field_name      = isset( $args['birthday_field_name'] ) ? $args['birthday_field_name'] : '';
		echo '<pre>';
		print_r( $field_name );
		echo '</pre>';

	}
}

// Initialize the singleton instance of the class.
BP_Birthday_API::get_instance();
