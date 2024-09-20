import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const BackContentEdit = ({attributes}) => {
	const { backgroundColorFront, padding } = attributes;
	const blockProps = useBlockProps( {
		className: 'flip-card-front',
	} );
	return (
		<>
			<div { ...blockProps }>
			<div style={{
					backgroundColor: backgroundColorFront,
					padding,
				}}>
				<InnerBlocks templateLock={ false } />
				</div>
			</div>
		</>
	);
}

export default BackContentEdit;
