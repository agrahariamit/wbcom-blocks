import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, PanelColorSettings, useBlockProps, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { ToolbarButton, PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

const ALLOWED_BLOCKS = ['core/paragraph', 'core/image', 'core/heading']; // Adjust as needed

const Edit = ({ attributes, setAttributes }) => {
    const { flipDirection, width, height, backgroundColorFront, backgroundColorBack, textColorBack, padding, alignment, } = attributes;
    const [selectedSide, setSelectedSide] = useState('front'); // State to track the currently selected side (front/back)

    const blockProps = useBlockProps({
        className: `flip-card ${flipDirection}`,
        style: {
            width,
            height,
        },
    });

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
                        max={600}
                    />
                    <RangeControl
                        label={__('Height (px)', 'flipbox')}
                        value={parseInt(height, 10)}
                        onChange={(value) => setAttributes({ height: `${value}px` })}
                        min={150}
                        max={600}
                    />
                    <RangeControl
                        label={__('Padding (px)', 'flipbox')}
                        value={parseInt(padding, 10) || 0}
                        onChange={(value) => setAttributes({ padding: `${value}px` })}
                        min={0}
                        max={50}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Color Settings', 'flipbox')}
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
                        {
                            value: textColorBack,
                            onChange: (color) => setAttributes({ textColorBack: color }),
                            label: __('Back Text Color', 'flipbox'),
                        },
                    ]}
                />
            </InspectorControls>

            {/* Main block content */}
            <div {...blockProps}>
                <div className="flip-card-inner">
                    <div
                        className={`flip-card-front ${selectedSide === 'front' ? 'is-selected' : ''}`}
                        style={{
                            backgroundColor: backgroundColorFront,
                            padding,
                            textAlign: alignment, // Apply alignment style
                        }}
                    >
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={[['core/paragraph', { placeholder: __('Add content to the front...', 'flipbox') }]]}
                            templateLock="all"
                        />
                    </div>
                    <div
                        className={`flip-card-back ${selectedSide === 'back' ? 'is-selected' : ''}`}
                        style={{
                            backgroundColor: backgroundColorBack,
                            color: textColorBack,
                            padding,
                            textAlign: alignment, // Apply alignment style
                        }}
                    >
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={[['core/paragraph', { placeholder: __('Add content to the back...', 'flipbox') }]]}
                            templateLock="all"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
