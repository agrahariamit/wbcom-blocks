import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const BackContentEdit = () => {
    const blockProps = useBlockProps( {
        className: 'flip-card-front',
    } );
    return (
        <>
            <div { ...blockProps }>
                <InnerBlocks templateLock={ false } />
            </div>
        </>
    );
}

export default BackContentEdit;
