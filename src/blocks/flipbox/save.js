import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const { flipDirection, width, height, backgroundColorFront, backgroundColorBack, padding, alignment, } = attributes;
    const blockProps = useBlockProps.save({
        className: `flip-card ${flipDirection}`,
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
                        padding,
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
