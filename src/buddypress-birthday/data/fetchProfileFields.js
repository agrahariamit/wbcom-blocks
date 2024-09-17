/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import apiFetch from '@wordpress/api-fetch';
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

export const fetchProfileFields = async () => {
    try {
        const fields = await apiFetch({ path: 'buddypress/v1/xprofile/fields' });
        // Filter and map the fields to return only the necessary options (e.g., datebox fields)
        return fields
            .filter((field) => field.type === 'datebox') // Filter to include only 'datebox' types
            .map((field) => ({
                value: field.id,
                label: field.name,
            }));
    } catch (err) {
        console.error('Error fetching xProfile fields:', err);
        return []; // Return an empty array in case of error
    }
};
