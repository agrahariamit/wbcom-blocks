/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 */
import '../editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {WPElement} Element to render.
 */
export default function Members({ birthdaysOf, xProfileField, limit }) {

    // Define state variables for form inputs
    const [members, setMembers] = useState([]);

    const queryParams = {
        'birthdays': birthdaysOf,
        'field': xProfileField,
        'limit': limit,
    }

    useEffect(() => {
        // Fetch members only once when the component mounts
        apiFetch({ path: addQueryArgs('/buddypress/v1/birthdays/1', queryParams) })
            .then((items) => {
                setMembers(items);
            })
            .catch((error) => {
                console.error('Error fetching members:', error);
            });
    }, []); // Empty dependency array ensures the effect runs only once

    return (
        <div {...useBlockProps()}>
            {members.length > 0 ? (
                members.map((member) => (
                    <div key={member.id}>
                        <div className="item-header-avatar">
                            <a href={member.link} target="_blank">
                                <img
                                    key={'avatar-' + member.id}
                                    className="avatar"
                                    alt={sprintf(__('Profile photo of %s', 'buddypress'), member.name)}
                                    src={member.avatar_urls['thumb']}
                                />
                            </a>
                        </div>
                        <div className="member-description">
                            {/* <div dangerouslySetInnerHTML={{ __html: member.latest_update.rendered }} /> */}
                            <a href={member.link}>
                                {(
                                    <span>
                                        {member.name}
                                    </span>
                                )}
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <p>{__('No members Found', 'buddypress-birthday')}</p>
            )}
        </div>
    );

}
