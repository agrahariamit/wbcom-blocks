/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { TextControl, Panel, PanelBody, PanelRow, CheckboxControl, SelectControl, RangeControl } from '@wordpress/components';
import Members from './data/members';
import { fetchProfileFields } from './data/fetchProfileFields'; // Note: Ensure this file and component exist and follow naming conventions

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    useEffect(() => {
        fetchProfileFields()
            .then((fields) => {
                setProfileFields(fields); // Set the fetched fields to state
            })
            .catch((err) => console.error('Error fetching profile fields:', err));
    }, []); // Fetch fields once on component mount



    const onChangeTitle = (title) => {
        setAttributes({ title: title });
    };

    const onCheckedAge = (displayAge) => {
        setAttributes({ displayAge: displayAge });
    }

    const onCheckedWishes = (sendMessage) => {
        setAttributes({ sendMessage: sendMessage });
    }

    const onChangeDateFormate = (dateFormat) => {
        setAttributes({ dateFormat: dateFormat });
    }

    const onChangeRangeLimit = (rangeLimit) => {
        setAttributes({ rangeLimit: rangeLimit });
    }
    const onChangeBirthdaysOf = (birthdaysOf) => {
        setAttributes({ birthdaysOf: birthdaysOf });
    }
    const onChangeNameTypet = (nameType) => {
        setAttributes({ nameType: nameType });
    }
    const onChangeLimit = (limit) => {
        setAttributes({ limit: limit });
    }

    const onChangeField = (field) => {
        setAttributes({ field });
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls key="setting">
                <Panel>
                    <PanelBody title={__('Member Information', 'block-development-examples')}>
                        <PanelRow>
                            <p>
                                {__('This block displays member information from a BuddyPress API endpoint.', 'block-development-examples')}
                            </p>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Title', 'block-development-examples')}
                                value={attributes.title}
                                onChange={onChangeTitle}
                            />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__(' Show the age of the person', 'block-development-examples')}
                                checked={attributes.displayAge}
                                onChange={onCheckedAge}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Enable option to wish them', 'block-development-examples')}
                                checked={attributes.sendMessage}
                                onChange={onCheckedWishes}
                            >
                            </CheckboxControl>
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Date format', 'block-development-examples')}
                                value={attributes.dateFormat}
                                onChange={onChangeDateFormate}
                            />  
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Birthday range limit', 'block-development-examples')}
                                value={attributes.rangeLimit}
                                onChange={onChangeRangeLimit}
                                options={[
                                    { value: 'no_limit', label: __('No limit', 'block-development-examples' )},
                                    { value: 'weekly', label: __('Weekly', 'block-development-examples' ) },
                                    { value: 'monthly', label: __('Monthly', 'block-development-examples' ) },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Show Birthdays of', 'block-development-examples')}
                                value={attributes.birthdaysOf}
                                onChange={onChangeBirthdaysOf}
                                options={[
                                    { value: 'friends', label: __('Friends', 'block-development-examples') },
                                    { value: 'all', label: __('All Members', 'block-development-examples') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <SelectControl
                                label={__('Display Name Type', 'block-development-examples')}
                                value={attributes.nameType}
                                onChange={onChangeNameTypet}
                                options={[
                                    { value: 'friends', label: __('Friends', 'block-development-examples') },
                                    { value: 'all', label: __('All Members', 'block-development-examples') },
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <RangeControl
                                label={__('Number of birthdays to show ', 'block-development-examples')}
                                value={attributes.limit}
                                onChange={onChangeLimit}
                            />
                        </PanelRow>
                        <SelectControl
                            label={__('Field name', 'block-development-examples')}
                            value={attributes.field}
                            options={profileFields} // Dynamically populated options from the API
                            onChange={onChangeField}
                        />
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <Members {...attributes}></Members>
        </div>
    );
}
