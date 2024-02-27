<?php
/**
 * Plugin Name:       BP Login Block
 * Description:       A Gutenberg block to display a BuddyPress login form with customizable options.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Wbcom Designs
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       reign
 *
 * @package           reign-bp-login
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Specifies the render callback for server-side rendering.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function reign_bp_login_block_init() {
	register_block_type_from_metadata(
		__DIR__,
		array(
			'render_callback' => 'reign_bp_login_block_render_callback',
		)
	);
}
add_action( 'init', 'reign_bp_login_block_init' );

/**
 * Render callback function for the BP Login block.
 *
 * This function generates the HTML markup for the BP Login block based on the user's login status.
 *
 * @param array $attributes The attributes passed to the block.
 *
 * @return string HTML markup for the BP Login block.
 */
function reign_bp_login_block_render_callback( $attributes ) {
	ob_start();

	if ( is_user_logged_in() ) {
		// Generate content for logged-in users.
		$user_display_name = bp_core_get_user_displayname( bp_loggedin_user_id() );
		$user_avatar       = bp_core_fetch_avatar(
			array(
				'item_id' => bp_loggedin_user_id(),
				'html'    => true,
			)
		);
		$profile_url       = bp_members_get_user_url( bp_loggedin_user_id() );
		$settings_url      = bp_loggedin_user_domain() . bp_get_settings_slug();
		$activity_url      = bp_loggedin_user_domain() . bp_get_activity_slug();
		$user_ID           = get_current_user_id();

		if ( ! $user_ID ) {
			return;
		}

		$author_name = wp_get_current_user()->display_name;
		if ( function_exists( 'buddypress' ) && version_compare( buddypress()->version, '12.0', '>=' ) ) {
			$author_url = bp_members_get_user_url( $user_ID );
		} else {
			$author_url = bp_core_get_user_domain( $user_ID );
		}
		$author_cover_image = bp_attachments_get_attachment(
			'url',
			array(
				'object_dir' => 'members',
				'item_id'    => $user_ID,
			)
		);
		$author_cover_image = $author_cover_image ? "background-image: url({$author_cover_image})" : '';

		echo '<div class="user-welcomeback">';
		echo '<div class="featured-background" style="' . esc_attr( $author_cover_image ) . '"></div>';
		echo '<div class="user-active">';
		echo '<a href="' . esc_url( $author_url ) . '" class="author-thumb">' . get_avatar( $user_ID, 90 ) . '</a>';
		echo '<div class="author-content">' . esc_html__( 'Welcome Back ', 'reign' ) . '<a href="' . esc_url( $author_url ) . '" class="author-name">' . esc_html( $author_name ) . '</a>!</div>';
		echo '</div>';
		echo '<div class="links">';
		if ( bp_is_active( 'activity' ) ) {
			echo '<a href="' . esc_url( bp_loggedin_user_domain() . bp_get_activity_slug() ) . '" class="link-item">';
			echo '<i class="link-item-icon far fa-comments"></i>';
			echo '<div class="title">' . esc_html__( 'Activity', 'reign' ) . '</div>';
			echo '<div class="sup-title">' . esc_html__( 'Review your activity!', 'reign' ) . '</div>';
			echo '</a>';
		}
		if ( bp_is_active( 'settings' ) ) {
			echo '<a href="' . esc_url( bp_loggedin_user_domain() . bp_get_settings_slug() ) . '" class="link-item">';
			echo '<i class="link-item-icon far fa-user-cog"></i>';
			echo '<div class="title">' . esc_html__( 'Settings', 'reign' ) . '</div>';
			echo '<div class="sup-title">' . esc_html__( 'Manage your preferences!', 'reign' ) . '</div>';
			echo '</a>';
		}
		echo '</div>';
		echo '<div class="reign-block-content">';
		echo '<a href="' . esc_url( $author_url ) . '" class="btn rg-action button full-width">' . esc_html__( 'Go to your Profile Page', 'reign' ) . '</a>';
		echo '</div>';
		echo '</div>';
	} else {
		// Generate content for non-logged-in users.
		global $wp_error;
		if ( isset( $wp_error ) && is_wp_error( $wp_error ) && $wp_error->get_error_code() ) {
			echo '<div class="error">' . esc_html( $wp_error->get_error_message() ) . '</div>';
		}

		$redirect_url = '';

		global $wbtm_reign_settings;
		$registration_page_url = wp_registration_url();
		if ( isset( $wbtm_reign_settings['reign_pages']['reign_register_page'] ) && ( $wbtm_reign_settings['reign_pages']['reign_register_page'] != '-1' && $wbtm_reign_settings['reign_pages']['reign_register_page'] != '' ) ) {
			$registration_page_id  = $wbtm_reign_settings['reign_pages']['reign_register_page'];
			$registration_page_url = get_permalink( $registration_page_id );
		}

		// Determine redirect URL based on attributes.
		switch ( $attributes['loginRedirect'] ) {
			case 'profile':
				$redirect_to = home_url( '/members/me' );
				break;
			case 'activity':
				$redirect_to = bp_loggedin_user_domain() . bp_get_activity_slug();
				break;
			case 'custom':
				$redirect_to = ! empty( $attributes['loginRedirectUrl'] ) ? esc_url( $attributes['loginRedirectUrl'] ) : site_url();
				break;
			case 'current':
			default:
				$redirect_to = esc_url( $_SERVER['REQUEST_URI'] );
				break;
		}

		// echo '<div class="bp-login-widget">';
		// echo '<h2>' . esc_html( $attributes['title'] ) . '</h2>';
		// echo '<form name="loginform" id="loginform" action="' . esc_url( site_url( 'wp-login.php', 'login_post' ) ) . '" method="post">';
		// echo '<p><label for="user_login">' . esc_html__( 'Username', 'reign' ) . '</label>';
		// echo '<input type="text" name="log" id="user_login" class="input" value="" size="20" /></p>';
		// echo '<p><label for="user_pass">' . esc_html__( 'Password', 'reign' ) . '</label>';
		// echo '<input type="password" name="pwd" id="user_pass" class="input" value="" size="20" /></p>';
		// echo '<p class="forgetmenot"><label for="rememberme">';
		// echo '<input name="rememberme" type="checkbox" id="rememberme" value="forever" />';
		// echo esc_html__( 'Remember Me', 'reign' ) . '</label></p>';
		// echo '<p class="submit">';
		// echo '<input type="submit" name="wp-submit" id="wp-submit" class="button button-primary button-large" value="' . esc_attr__( 'Log In', 'reign' ) . '" />';
		// echo '<input type="hidden" name="redirect_to" value="' . $redirect_to . '" />';
		// wp_nonce_field( 'bp-login-nonce' );
		// echo '</p></form>';
		// echo '<a href="' . esc_url( wp_lostpassword_url() ) . '">' . esc_html__( 'Forgot my Password', 'reign' ) . '</a>';
		// echo '</div>';

		?>
		<div class="registration-login-form">
			<div class="title h6"><?php echo ( '' !== $attributes['title'] ) ? esc_html( $attributes['title'] ) : esc_html__( 'Login to your Account', 'reign' ); ?></div>

			<form data-handler="reign-signin-form" class="content reign-sign-form-login reign-sign-form" method="POST" action="<?php echo esc_url( site_url( 'wp-login.php', 'login_post' ) ); ?>">

				<input class="simple-input" type="hidden" value="<?php echo esc_attr( wp_create_nonce( 'reign-sign-form' ) ); ?>" name="_ajax_nonce" />

				<input class="simple-input" type="hidden" name="redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>"/>

				<?php do_action( 'reign_login_form_top' ); ?>

				<ul class="reign-sign-form-messages"></ul>

				<div class="row">
					<div class="col">
						<div class="form-group label-floating">
							<label class="control-label"><?php esc_html_e( 'Username', 'reign' ); ?></label>
							<input class="form-control simple-input" name="log" type="text">
						</div>
						<div class="form-group label-floating password-eye-wrap">
							<label class="control-label"><?php esc_html_e( 'Your Password', 'reign' ); ?></label>
							<a href="#" class="fa fa-fw fa-eye password-eye" tabindex="-1"></a>
							<input class="form-control simple-input" name="pwd"  type="password">
						</div>

						<div class="remember">
							<div class="checkbox">
								<label>
									<input name="rememberme" value="forever" type="checkbox">
									<?php esc_html_e( 'Remember Me', 'reign' ); ?>
								</label>
							</div>

							<?php
							if ( get_option( 'users_can_register' ) ) {
								?>
								<a href="<?php echo esc_url( $registration_page_url ); ?>" class="register"><?php esc_html_e( 'Register', 'reign' ); ?></a>
								<?php
							} elseif ( function_exists( 'bp_is_active' ) && bp_get_option( 'bp-enable-membership-requests' ) ) {
								?>
								<a href="<?php echo esc_url( $registration_page_url ); ?>" class="register"><?php esc_html_e( 'Register', 'reign' ); ?></a>
								<?php
							}
							?>

							<?php $lostpswd = apply_filters( 'reign_lostpassword_url', wp_lostpassword_url() ); ?>
							<a href="<?php echo esc_url( wp_lostpassword_url() ); ?>" class="forgot"><?php esc_html_e( 'Forgot my Password', 'reign' ); ?></a>
						</div>

						<?php do_action( 'reign_recaptcha_after_login_form' ); ?>

						<button type="submit" class="btn full-width registration-login-submit">
							<span><?php esc_html_e( 'Login', 'reign' ); ?></span>
							<span class="icon-loader"></span>
						</button>

						<?php do_action( 'reign_login_form_bottom' ); ?>

						<?php
						if ( '' !== $attributes['loginDescription'] ) {
							echo '<p>' . esc_html( $attributes['loginDescription'] ) . '</p>';
						} else {
							printf(
								'<p>%s %s %s</p>',
								esc_html__( 'Don\'t you have an account?', 'reign' ),
								esc_html__( 'Register Now!', 'reign' ),
								esc_html__( 'it\'s really simple and you can start enjoying all the benefits!', 'reign' )
							);
						}
						?>
					</div>
				</div>
			</form>
		</div>
		<?php
	}

	return ob_get_clean();
}
