import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const BackContentEdit = ({attributes}) => {
	const { backgroundColorBack, padding } = attributes;
	const blockProps = useBlockProps( {
		className: 'flip-card-back',
	} );
	return (
		<>
			<div { ...blockProps }>
				<div style={{
					backgroundColor: backgroundColorBack,
					padding,
				}}>
					<InnerBlocks templateLock={ false } />
				</div>
			</div>
		</>
	);
}

export default BackContentEdit;
