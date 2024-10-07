<?php
/**
 * Render the BuddyPress Members Block
 */

$sort_type         = isset( $attributes['sortType'] ) ? $attributes['sortType'] : 'active';
$limit             = isset( $attributes['limit'] ) ? $attributes['limit'] : 10;
$avatar_size       = isset( $attributes['avatarSize'] ) ? $attributes['avatarSize'] : 100;
$avatar_radius     = isset( $attributes['avatarRadius'] ) ? $attributes['avatarRadius'] : 0;
$view_type         = isset( $attributes['viewType'] ) ? $attributes['viewType'] : 'list';
$members_per_row   = isset( $attributes['membersPerRow'] ) ? $attributes['membersPerRow'] : 4;
$row_spacing       = isset( $attributes['rowSpacing'] ) ? $attributes['rowSpacing'] : 15;
$column_spacing    = isset( $attributes['columnSpacing'] ) ? $attributes['columnSpacing'] : 15;
$inner_spacing     = isset( $attributes['innerSpacing'] ) ? $attributes['innerSpacing'] : 15;
$box_border_radius = isset( $attributes['boxBorderRadius'] ) ? $attributes['boxBorderRadius'] : 4;

$endpoint = "/buddypress/v1/members?per_page={$limit}&type={$sort_type}";
$response = wp_remote_get( rest_url( $endpoint ) );
if ( is_wp_error( $response ) ) {
	echo '<p>' . esc_html__( 'An error occurred while retrieving members.', 'buddypress-members' ) . '</p>';
	return;
}

$members = wp_remote_retrieve_body( $response );
$members = json_decode( $members, true );

if ( empty( $members ) || ! is_array( $members ) ) {
	echo '<p>' . esc_html__( 'No members found.', 'buddypress-members' ) . '</p>';
	return;
}

if ( ! function_exists( 'render_member_item' ) ) {
	/**
	 * Renders a member's avatar, name, and last activity.
	 *
	 * @param array $member An associative array containing member data, including
	 *                      the member's avatar URL, name, and last activity details.
	 * @param int   $avatar_size The size (width and height) of the member's avatar image.
	 * @param int   $avatar_radius The border radius to apply to the avatar image for styling.
	 */
	function render_member_item( $member, $avatar_size, $avatar_radius ) {
		// Get last activity for this member.
		$last_activity         = bp_get_user_meta( $member['id'], 'last_activity', true );
		$last_activity_display = $last_activity ? bp_core_time_since( $last_activity ) : __( 'No recent activity', 'buddypress-members' );
		?>
		<div class="bp-member-item">
			<a href="<?php echo esc_url( $member['link'] ); ?>">
				<img src="<?php echo esc_url( $member['avatar_urls']['full'] ); ?>" 
					alt="<?php echo esc_attr( $member['name'] ); ?>" 
					class="bp-member-avatar avatar" 
					style="width: <?php echo esc_attr( $avatar_size ); ?>px; 
							height: <?php echo esc_attr( $avatar_size ); ?>px; 
							border-radius: <?php echo esc_attr( $avatar_radius ); ?>px;" />
			</a>
			<div class="item-block">
				<div class="bp-member-name">
					<a href="<?php echo esc_url( $member['link'] ); ?>">
						<?php echo esc_html( $member['name'] ); ?>
					</a>
				</div>
				<div class="bp-member-last-activity">
					<?php echo esc_html( $last_activity_display ); ?>
				</div>
			</div>
		</div>
		<?php
	}
}
?>

<div <?php echo esc_attr( get_block_wrapper_attributes() ); ?> 
	style="
		--members-per-row: <?php echo esc_attr( $members_per_row ); ?>;
		--row-spacing: <?php echo esc_attr( $row_spacing ); ?>px;
		--column-spacing: <?php echo esc_attr( $column_spacing ); ?>px;
		--avatar-size: <?php echo esc_attr( $avatar_size ); ?>px;
		--avatar-radius: <?php echo esc_attr( $avatar_radius ); ?>px;
		--inner-spacing: <?php echo esc_attr( $inner_spacing ); ?>px;
		--box-border-radius: <?php echo esc_attr( $box_border_radius ); ?>px;">

	<div class="bp-members-preview <?php echo esc_attr( $view_type ); ?>">
		<?php if ( $view_type === 'carousel' ) : ?>
			<div class="swiper">
				<div class="swiper-container">
					<div class="swiper-wrapper" slides-per-view="<?php echo esc_attr( $members_per_row ); ?>">
						<?php foreach ( $members as $member ) : ?>
							<div class="swiper-slide">
								<?php render_member_item( $member, $avatar_size, $avatar_radius ); ?>
							</div>
						<?php endforeach; ?>
					</div>
					<div class="swiper-button-next"></div>
					<div class="swiper-button-prev"></div>
				</div>
			</div>
		<?php else : ?>
			<?php foreach ( $members as $member ) : ?>
				<?php render_member_item( $member, $avatar_size, $avatar_radius ); ?>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</div>
