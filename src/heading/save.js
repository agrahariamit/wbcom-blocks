import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({attributes}) {

	return (
		<RichText.Content 
			{ ...useBlockProps.save() } 
			tagName="h2" 
			value={ attributes.content }
		/>
	);
}

 