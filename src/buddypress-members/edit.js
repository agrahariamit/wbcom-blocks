/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, SelectControl, RangeControl, ButtonGroup, Button, Spinner } from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const { sortType, viewType, limit, avatarSize, avatarRadius, membersPerRow, rowSpacing, columnSpacing, innerSpacing, boxBorderRadius } = attributes;
    const blockProps = useBlockProps();

    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        let endpoint = `/buddypress/v1/members?per_page=${limit}`;

        if (sortType === 'active') {
            endpoint += '&type=active';
        } else if (sortType === 'popular') {
            endpoint += '&type=popular';
        } else if (sortType === 'newest') {
            endpoint += '&type=newest';
        }

        apiFetch({ path: endpoint })
            .then((response) => {
                setMembers(response);
                setIsLoading(false);
            })
            .catch((err) => {
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
                        <Button
                            isPressed={viewType === 'list'}
                            onClick={() => setAttributes({ viewType: 'list' })}
                        >
                            {__('List', 'buddypress-members')}
                        </Button>
                        <Button
                            isPressed={viewType === 'grid'}
                            onClick={() => setAttributes({ viewType: 'grid' })}
                        >
                            {__('Grid', 'buddypress-members')}
                        </Button>
                        <Button
                            isPressed={viewType === 'carousel'}
                            onClick={() => setAttributes({ viewType: 'carousel' })}
                        >
                            {__('Carousel', 'buddypress-members')}
                        </Button>
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
                {(viewType === 'grid') && (
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
                        <Swiper
                            slidesPerView={membersPerRow}
                        >
                            {members.map((member) => (
                                <SwiperSlide key={member.id}>
                                    <div className="bp-member-item">
                                        <a href={member.link}>
                                            <img
                                                src={member.avatar_urls.full}
                                                alt={member.name}
                                                className="bp-member-avatar"
                                                style={{ width: `${avatarSize}px`, height: `${avatarSize}px`, borderRadius: `${avatarRadius}px` }}
                                            />
                                        </a>
                                        <a href={member.link}><div className="bp-member-name">{member.name}</div></a>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="swiper-button-next"></div>
                            <div className="swiper-button-prev"></div>
                        </Swiper>
                    </div>
                ) : (
                    members.map((member) => (
                        <div className="bp-member-item" key={member.id}>
                            <a href={member.link}>
                                <img
                                    src={member.avatar_urls.full}
                                    alt={member.name}
                                    className="bp-member-avatar avatar"
                                    style={{ width: `${avatarSize}px`, height: `${avatarSize}px`, borderRadius: `${avatarRadius}px` }}
                                />
                            </a>
                            <a href={member.link}><div className="bp-member-name">{member.name}</div></a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
