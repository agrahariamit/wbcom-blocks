import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ButtonGroup, Button, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './editor.scss';

const MemberItem = ({ member, lastActivity, avatarSize, avatarRadius }) => {
    return (
        <div className="bp-member-item">
            <a href={member.link}>
                <img
                    src={member.avatar_urls?.full}
                    alt={member.name}
                    className="bp-member-avatar"
                    style={{
                        width: `${avatarSize}px`,
                        height: `${avatarSize}px`,
                        borderRadius: `${avatarRadius}px`,
                    }}
                />
            </a>
            <div className="item-block">
                <div className="bp-member-name">
                    <a href={member.link}>
                        {member.name}
                    </a>
                </div>
                <div className="bp-member-last-activity">
                    {lastActivity || __('No recent activity', 'buddypress-members')}
                </div>
            </div>
        </div>
    );
};

export default function Edit({ attributes, setAttributes }) {
    const { sortType, viewType, limit, avatarSize, avatarRadius, membersPerRow, rowSpacing, columnSpacing, innerSpacing, boxBorderRadius } = attributes;
    const blockProps = useBlockProps();

    const [members, setMembers] = useState([]);
    const [lastActivity, setLastActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const memberEndpoint = `/buddypress/v1/members?per_page=${limit}&type=${sortType}`;
        const activityEndpoint = `/buddypress/v1/members/last-activity?per_page=${limit}&type=${sortType}`;

        Promise.all([
            apiFetch({ path: memberEndpoint }),
            apiFetch({ path: activityEndpoint }),
        ])
        .then(([membersData, lastActivityData]) => {
            setMembers(membersData);
            setLastActivity(lastActivityData.map(activity => activity.last_activity));
            setIsLoading(false);
        })
        .catch(() => {
            setError(__('Failed to load members', 'buddypress-members'));
            setIsLoading(false);
        });
    }, [sortType, limit]);

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Member Sorting', 'buddypress-members')}>
                    <SelectControl
                        label={__('Sort By', 'buddypress-members')}
                        value={sortType}
                        options={[
                            { label: __('Recently Active', 'buddypress-members'), value: 'active' },
                            { label: __('Popular', 'buddypress-members'), value: 'popular' },
                            { label: __('Newest', 'buddypress-members'), value: 'newest' },
                        ]}
                        onChange={(value) => setAttributes({ sortType: value })}
                    />
                    <RangeControl
                        label={__('Number of Members', 'buddypress-members')}
                        value={limit}
                        onChange={(value) => setAttributes({ limit: value })}
                        min={1}
                        max={20}
                    />
                </PanelBody>
                <PanelBody title={__('Layout View', 'buddypress-members')}>
                    <ButtonGroup>
                        {['list', 'grid', 'carousel'].map((type) => (
                            <Button
                                key={type}
                                isPressed={viewType === type}
                                onClick={() => setAttributes({ viewType: type })}
                            >
                                {__(type.charAt(0).toUpperCase() + type.slice(1), 'buddypress-members')}
                            </Button>
                        ))}
                    </ButtonGroup>
                </PanelBody>
                {(viewType === 'grid' || viewType === 'carousel') && (
                    <PanelBody title={__('Members Per Row', 'buddypress-members')}>
                        <RangeControl
                            label={__('Number of Members', 'buddypress-members')}
                            value={membersPerRow}
                            onChange={(value) => setAttributes({ membersPerRow: value })}
                            min={1}
                            max={5}
                        />
                    </PanelBody>
                )}
                {viewType === 'list' && (
                    <PanelBody title={__('Row Spacing', 'buddypress-members')}>
                        <RangeControl
                            label={__('Row Spacing (px)', 'buddypress-members')}
                            value={rowSpacing}
                            onChange={(value) => setAttributes({ rowSpacing: value })}
                            min={0}
                            max={50}
                        />
                    </PanelBody>
                )}
                {viewType === 'grid' && (
                    <PanelBody title={__('Spacing', 'buddypress-members')}>
                        <RangeControl
                            label={__('Column Spacing (px)', 'buddypress-members')}
                            value={columnSpacing}
                            onChange={(value) => setAttributes({ columnSpacing: value })}
                            min={0}
                            max={50}
                        />
                        <RangeControl
                            label={__('Inner Spacing (px)', 'buddypress-members')}
                            value={innerSpacing}
                            onChange={(value) => setAttributes({ innerSpacing: value })}
                            min={0}
                            max={30}
                        />
                        <RangeControl
                            label={__('Box Border Radius (px)', 'buddypress-members')}
                            value={boxBorderRadius}
                            onChange={(value) => setAttributes({ boxBorderRadius: value })}
                            min={0}
                            max={20}
                        />
                    </PanelBody>
                )}
                <PanelBody title={__('Avatar Size', 'buddypress-members')}>
                    <RangeControl
                        label={__('Avatar Size (px)', 'buddypress-members')}
                        value={avatarSize}
                        onChange={(value) => setAttributes({ avatarSize: value })}
                        min={50}
                        max={300}
                    />
                    <RangeControl
                        label={__('Avatar Border Radius (px)', 'buddypress-members')}
                        value={avatarRadius}
                        onChange={(value) => setAttributes({ avatarRadius: value })}
                        min={0}
                        max={100}
                    />
                </PanelBody>
            </InspectorControls>

            <div
                className={`bp-members-preview ${viewType}`}
                style={{
                    '--row-spacing': viewType === 'list' ? `${rowSpacing}px` : undefined,
                    '--column-spacing': viewType === 'grid' ? `${columnSpacing}px` : undefined,
                    '--members-per-row': viewType === 'grid' ? membersPerRow : undefined,
                    '--inner-spacing': viewType === 'grid' ? `${innerSpacing}px` : undefined,
                    '--box-border-radius': viewType === 'grid' ? `${boxBorderRadius}px` : undefined,
                }}
            >
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <div>{error}</div>
                ) : members.length === 0 ? (
                    <div>{__('No members found', 'buddypress-members')}</div>
                ) : viewType === 'carousel' ? (
                    <div className="swiper-container">
                        <Swiper slidesPerView={membersPerRow}>
                            {members.map((member, index) => (
                                <SwiperSlide key={member.id}>
                                    <MemberItem
                                        member={member}
                                        lastActivity={lastActivity[index] || __('No recent activity', 'buddypress-members')}
                                        avatarSize={avatarSize}
                                        avatarRadius={avatarRadius}
                                    />
                                </SwiperSlide>
                            ))}
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                        </Swiper>
                    </div>
                ) : (
                    members.map((member, index) => (
                        <MemberItem
                            key={member.id}
                            member={member}
                            lastActivity={lastActivity[index] || __('No recent activity', 'buddypress-members')}
                            avatarSize={avatarSize}
                            avatarRadius={avatarRadius}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
