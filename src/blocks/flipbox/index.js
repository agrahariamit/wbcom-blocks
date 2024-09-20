/**
 * Registers a new block provided a unique name and an object defining its behavior.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './style.scss';
/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import FrontContentEdit from './front-content/front';
import BackContentEdit from './front-content/front';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );

registerBlockType('flipbox/front-content', {
	title: 'Front Content',
	parent: ['flipbox'],
	category: 'wbcom-designs',
	edit: FrontContentEdit,
	save,
});

registerBlockType('flipbox/back-content', {
	title: 'Back Content',
	parent: ['flipbox'],
	category: 'wbcom-designs',
	edit: BackContentEdit,
	save,
});