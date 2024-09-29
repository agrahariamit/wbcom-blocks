import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, PanelColorSettings, useBlockProps, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { ToolbarButton, PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

const Edit = ({ attributes, setAttributes }) => {
    const { flipDirection, width, height, backgroundColorFront, backgroundColorBack, padding, alignment, } = attributes;
    const [selectedSide, setSelectedSide] = useState('front'); // State to track the currently selected side (front/back)

    const blockProps = useBlockProps({
        className: `flip-card ${flipDirection}`,
        style: {
            width,
            height,
        },
    });

    const ALLOWED_BLOCKS = [
		['flipbox/front-content'],
        ['flipbox/back-content'],
	];
	const TEMPLATE = [
        ['flipbox/front-content'],
        ['flipbox/back-content'],
    ];

    return (
        <>
            {/* Block Controls Toolbar for switching between Front and Back */}
            <BlockControls>
                <AlignmentControl
                    value={alignment}
                    onChange={(newAlign) => setAttributes({ alignment: newAlign })}
                />
                <ToolbarButton
                    isPressed={selectedSide === 'front'}
                    onClick={() => setSelectedSide('front')}
                >
                    {__('Front', 'flipbox')}
                </ToolbarButton>
                <ToolbarButton
                    isPressed={selectedSide === 'back'}
                    onClick={() => setSelectedSide('back')}
                >
                    {__('Back', 'flipbox')}
                </ToolbarButton>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Flip Settings', 'flipbox')}>
                    <SelectControl
                        label={__('Flip Direction', 'flipbox')}
                        value={flipDirection}
                        options={[
                            { label: __('Left to Right', 'flipbox'), value: 'left-to-right' },
                            { label: __('Right to Left', 'flipbox'), value: 'right-to-left' },
                            { label: __('Top to Bottom', 'flipbox'), value: 'top-to-bottom' },
                            { label: __('Bottom to Top', 'flipbox'), value: 'bottom-to-top' },
                        ]}
                        onChange={(value) => setAttributes({ flipDirection: value })}
                    />
                    <RangeControl
                        label={__('Width (px)', 'flipbox')}
                        value={parseInt(width, 10)}
                        onChange={(value) => setAttributes({ width: `${value}px` })}
                        min={150}
                        max={4000}
                    />
                    <RangeControl
                        label={__('Height (px)', 'flipbox')}
                        value={parseInt(height, 10)}
                        onChange={(value) => setAttributes({ height: `${value}px` })}
                        min={150}
                        max={4000}
                    />
                    <RangeControl
                        label={__('Padding (px)', 'flipbox')}
                        value={parseInt(padding, 10) || 0}
                        onChange={(value) => setAttributes({ padding: `${value}px` })}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Flip Box Background Color', 'flipbox')}
                    colorSettings={[
                        {
                            value: backgroundColorFront,
                            onChange: (color) => setAttributes({ backgroundColorFront: color }),
                            label: __('Front Background Color', 'flipbox'),
                        },
                        {
                            value: backgroundColorBack,
                            onChange: (color) => setAttributes({ backgroundColorBack: color }),
                            label: __('Back Background Color', 'flipbox'),
                        },
                    ]}
                />
            </InspectorControls>

            {/* Main block content */}
            <div {...blockProps}>
                <div className="flip-card-inner">
                    <div
                        className={`flip-card ${selectedSide === 'front' ? 'is-front-selected' : 'is-back-selected'}`}
                        style={{
                            backgroundColor: selectedSide === 'front' ? backgroundColorFront : backgroundColorBack,
                            padding,
                            textAlign: alignment, // Apply alignment style
                        }}
                        >
                        <InnerBlocks
                            allowedBlocks={ ALLOWED_BLOCKS }
                            template={ TEMPLATE }
                            templateLock="all"
                            placeholder={[(`Add content to the ${selectedSide}...`, 'flipbox')]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
