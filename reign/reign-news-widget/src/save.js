import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	const dataAttributes = JSON.stringify(attributes);

	return (
		<div {...blockProps} data-attributes={dataAttributes}>
			{/* Placeholder content for the editor */}
			<p>Loading news widget...</p>
		</div>
	);
}
