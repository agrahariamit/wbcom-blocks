import { __ } from '@wordpress/i18n';

import { useBlockProps, RichText } from '@wordpress/block-editor';

import './editor.scss';


export default function Edit({ attributes, setAttributes }) {
    
    function editContentHandler(newVal){
        setAttributes({content: newVal });
    }
   
    return (
        <RichText 
            {...useBlockProps() } 
            value={ attributes.content }
            onChange={editContentHandler}   
            tagName='h2'
            placeholder='Place your heading here.'
        />
    );
}
