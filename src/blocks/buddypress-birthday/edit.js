/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import {
    TextControl,
    Panel,
    PanelBody,
    PanelRow,
    ToggleControl,
    ComboboxControl,
    SelectControl,
    RangeControl
} from '@wordpress/components';
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
    const {
        displayAge,
        sendMessage,
        dateFormat,
        rangeLimit,
        birthdaysOf,
        displayNameType,
        limit,
        xProfileField
    } = attributes;

    const [profileFields, setProfileFields] = useState([]);

    useEffect(() => {
        fetchProfileFields()
            .then(setProfileFields)
            .catch((err) => console.error('Error fetching profile fields:', err));
    }, []);
    

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__('Member Information', 'block-development-examples')}>
                        <PanelRow>
                            <p>{__('This block displays member information from a BuddyPress API endpoint.', 'block-development-examples')}</p>
                        </PanelRow>
                        <PanelRow>
                            <ToggleControl
                                label={__('Show the age of the person', 'block-development-examples')}
                                checked={displayAge}
                                onChange={(value) => setAttributes({ displayAge: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ToggleControl
                                label={__('Enable option to wish them', 'block-development-examples')}
                                checked={sendMessage}
                                onChange={(value) => setAttributes({ sendMessage: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Date format', 'block-development-examples')}
                                value={dateFormat}
                                onChange={(value) => setAttributes({ dateFormat: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ComboboxControl
                                label={__('Birthday range limit', 'block-development-examples')}
                                value={rangeLimit}
                                options={[
                                    { value: 'no_limit', label: __('No limit', 'block-development-examples') },
                                    { value: 'weekly', label: __('Weekly', 'block-development-examples') },
                                    { value: 'monthly', label: __('Monthly', 'block-development-examples') },
                                ]}
                                onChange={(value) => setAttributes({ rangeLimit: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ComboboxControl
                                label={__('Show Birthdays of', 'block-development-examples')}
                                value={birthdaysOf}
                                options={[
                                    { value: 'friends', label: __('Friends', 'block-development-examples') },
                                    { value: 'all', label: __('All Members', 'block-development-examples') },
                                ]}
                                onChange={(value) => setAttributes({ birthdaysOf: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ComboboxControl
                                label={__('Display Name Type', 'block-development-examples')}
                                value={displayNameType}
                                options={[
                                    { value: 'user_name', label: __('User name', 'block-development-examples') },
                                    { value: 'nick_name', label: __('Nick name', 'block-development-examples') },
                                    { value: 'first_name', label: __('First Name', 'block-development-examples') },
                                ]}
                                onChange={(value) => setAttributes({ displayNameType: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <RangeControl
                                label={__('Number of birthdays to show', 'block-development-examples')}
                                value={limit}
                                onChange={(value) => setAttributes({ limit: value })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <ComboboxControl
                                label={__('Field name', 'block-development-examples')}
                                value={xProfileField}
                                options={profileFields}
                                onChange={(value) => setAttributes({ xProfileField: value })}
                            />
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <Members {...attributes} />
        </div>
    );
}
