<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class BP_Members_API
 */
class BP_Members_API {

	/**
	 * Holds the single instance of the class.
	 *
	 * @var BP_Members_API|null
	 */
	private static $instance = null;

	/**
	 * BP_Members_API constructor.
	 * Initializes the REST API routes for BuddyPress members.
	 */
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	private function __clone() {}

	public function __wakeup() {}

	/**
	 * Returns the singleton instance of the BP_Members_API class.
	 *
	 * @return BP_Members_API The instance of this class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Registers the REST API routes for BuddyPress members.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			'buddypress/v1',
			'/members/last-activity',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'bp_custom_member_last_activity' ),
				'args'     => array(
					'type'     => array(
						'validate_callback' => function ( $param ) {
							return in_array( $param, array( 'active', 'popular', 'newest' ) );
						},
					),
					'per_page' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param ) && $param > 0 && $param <= 20; // Adjust max limit as needed
						},
					),
				),
			)
		);
	}

	/**
	 * Formats the time difference between the current time and the given activity time.
	 *
	 * @param int $activity_time The timestamp of the last activity.
	 * @return string A human-readable time difference.
	 */
	public function format_time_difference( $activity_time ) {
		$time_difference = time() - $activity_time;

		if ( $time_difference < MINUTE_IN_SECONDS ) {
			return __( 'Just now', 'buddypress-members' );
		} elseif ( $time_difference < HOUR_IN_SECONDS ) {
			$minutes = floor( $time_difference / MINUTE_IN_SECONDS );
			return sprintf( _n( '%d minute ago', '%d minutes ago', $minutes, 'buddypress-members' ), $minutes );
		} elseif ( $time_difference < DAY_IN_SECONDS ) {
			$hours   = floor( $time_difference / HOUR_IN_SECONDS );
			$minutes = floor( ( $time_difference % HOUR_IN_SECONDS ) / MINUTE_IN_SECONDS );
			return sprintf( '%d hours, %d minutes ago', $hours, $minutes );
		} else {
			$days = floor( $time_difference / DAY_IN_SECONDS );
			if ( $days < 7 ) {
				return sprintf( _n( '%d day ago', '%d days ago', $days, 'buddypress-members' ), $days );
			} else {
				$weeks = floor( $days / 7 );
				return sprintf( _n( '%d week ago', '%d weeks ago', $weeks, 'buddypress-members' ), $weeks );
			}
		}
	}

	/**
	 * Retrieves the last activity of BuddyPress members and returns it as a REST response.
	 *
	 * @param WP_REST_Request $request The REST API request object.
	 * @return WP_REST_Response A response object containing member data or error message.
	 */
	public function bp_custom_member_last_activity( WP_REST_Request $request ) {
		if ( ! function_exists( 'bp_has_members' ) ) {
			return new WP_REST_Response( array( 'message' => __( 'BuddyPress is not active.', 'buddypress-members' ) ), 400 );
		}

		// Get parameters from the request.
		$per_page = $request->get_param( 'per_page' ) ?: 10;
		$type     = $request->get_param( 'type' ) ?: 'active';

		// Fetch members based on type and limit.
		$args    = array(
			'per_page' => $per_page,
			'type'     => $type,
		);
		$members = bp_core_get_users( $args );

		if ( empty( $members['users'] ) ) {
			return new WP_REST_Response( array( 'message' => __( 'No members found.', 'buddypress-members' ) ), 404 );
		}

		// Prepare response data.
		$data = array();
		foreach ( $members['users'] as $member ) {
			$activity       = bp_get_user_last_activity( $member->ID );
			$formatted_time = $activity ? $this->format_time_difference( strtotime( $activity ) ) : __( 'No recent activity', 'buddypress-members' );

			$data[] = array(
				'name'          => $member->display_name,
				'last_activity' => $formatted_time,
			);
		}

		return new WP_REST_Response( $data, 200 );
	}
}

// Initialize the singleton instance of the class.
BP_Members_API::get_instance();
