import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	// For a dynamic block, return null since the server will render the content.
	return null;
}
