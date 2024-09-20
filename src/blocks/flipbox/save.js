import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const { width, height, backgroundColorFront, backgroundColorBack, alignment, } = attributes;
    const blockProps = useBlockProps.save({
        className: `flip-card`,
        style: {
            width,
            height,
        },
    });

    return (
        <>
        <div {...blockProps}>
                <div
                    className="flip-card-inner"
                    style={{
                        backgroundColor: backgroundColorBack,
                        backgroundColor: backgroundColorFront,
                        textAlign: alignment, // Apply alignment style
                    }}
                    >
                 <InnerBlocks.Content />
            </div>
        </div>
        </>
    );
};

export default Save;
